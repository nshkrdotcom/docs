import {
  AppFocus,
  FollowMode,
  LensMode,
  TraceEvent,
  FileItem,
  Finding
} from './types';
import { codebaseFiles } from './codebase';
import {
  nodeIncarnations,
  processIncarnations,
  traceEvents,
  comparisonMilestones,
  initialSupervisionNodes,
  initialFindings
} from './trace_data';

// --- Global Application State ---
const appState: AppFocus = {
  lens: 'cockpit',
  followMode: 'role',
  activeFileIndex: 7, // Default: lib/pipeline/command_worker.ex
  activeEventIndex: 10, // Default: ev-11 (Attempt #1 Gateway)
  activeSymbolKey: 'Pipeline.CommandWorker.recover/2',
  pinnedFileIndex: 7,
  pinnedLine: 57,
  pinnedSymbolKey: 'Pipeline.CommandWorker.recover/2 (baseline)',
  isPinnedSplit: false,
  selectedProcessId: 'node-b-boot-1/worker-pid1',
  selectedNodeId: 'node-b-boot-1',
  epoch: 1
};

let isPlaying = false;
let playInterval: number | null = null;
let commandPaletteOpen = false;
let shortcutsModalOpen = false;
let findingsList: Finding[] = JSON.parse(JSON.stringify(initialFindings));
let fileSearchQuery = '';

// --- Helper Functions ---
function getActiveEvent(): TraceEvent {
  return traceEvents[appState.activeEventIndex] || traceEvents[0];
}

function getActiveFile(): FileItem {
  return codebaseFiles[appState.activeFileIndex] || codebaseFiles[0];
}

function getPinnedFile(): FileItem {
  return codebaseFiles[appState.pinnedFileIndex ?? 7] || codebaseFiles[0];
}

function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Highlight Elixir syntax
function highlightSyntax(code: string): string {
  const re = /(#[^\n]*|"(?:\\.|[^"\\])*"|\b(?:defmodule|defp|def|do|end|case|with|else|when|fn|if|true|false|nil|use|alias|import|require|@impl|@moduledoc|@spec|@behaviour|@doc|test|assert)\b|@[a-z_]+|:[a-z][\w!?]*|\b[A-Z][A-Za-z0-9_.]*\b|\b\d+\b|\b[a-z][a-z0-9_!?]*(?=\())/g;
  let out = '';
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, match.index));
    const token = match[0];
    let cls = 'tok-fn';

    if (token.startsWith('#')) cls = 'tok-comment';
    else if (token.startsWith('"')) cls = 'tok-string';
    else if (token.startsWith(':')) cls = 'tok-atom';
    else if (token.startsWith('@')) cls = 'tok-attr';
    else if (/^\d+$/.test(token)) cls = 'tok-num';
    else if (/^[A-Z]/.test(token)) cls = 'tok-module';
    else if (/^(defmodule|defp|def|do|end|case|with|else|when|fn|if|true|false|nil|use|alias|import|require|test|assert)$/.test(token)) cls = 'tok-keyword';

    out += `<span class="${cls}">${escapeHtml(token)}</span>`;
    last = match.index + token.length;
  }
  return out + escapeHtml(code.slice(last));
}

// --- Navigation & Scrubber Actions ---
export function setEventIndex(idx: number, fromPlayback = false): void {
  const clamped = Math.max(0, Math.min(idx, traceEvents.length - 1));
  appState.activeEventIndex = clamped;
  appState.epoch++;

  const ev = traceEvents[clamped];
  appState.selectedProcessId = ev.processInstanceId;
  appState.selectedNodeId = ev.nodeInstanceId;

  // Correlate event to code file if not pinned
  if (ev.sourceRef && appState.followMode !== 'free') {
    const fileIdx = codebaseFiles.findIndex(f => f.path === ev.sourceRef.filePath);
    if (fileIdx !== -1) {
      appState.activeFileIndex = fileIdx;
      appState.activeSymbolKey = ev.sourceRef.symbolKey;
    }
  }

  renderApp(fromPlayback);

  // Scroll active code line into view smoothly
  requestAnimationFrame(() => {
    const el = document.querySelector('.code-line.is-active-line');
    if (el) {
      el.scrollIntoView({ behavior: fromPlayback ? 'auto' : 'smooth', block: 'center' });
    }
  });
}

export function setFileIndex(idx: number): void {
  appState.activeFileIndex = Math.max(0, Math.min(idx, codebaseFiles.length - 1));
  const file = codebaseFiles[appState.activeFileIndex];
  if (file.symbols.length > 0) {
    appState.activeSymbolKey = file.symbols[0].symbolKey;
  }
  appState.epoch++;
  renderApp();
}

export function togglePlayback(): void {
  isPlaying = !isPlaying;
  if (isPlaying) {
    playInterval = window.setInterval(() => {
      if (appState.activeEventIndex >= traceEvents.length - 1) {
        setEventIndex(0, true);
      } else {
        setEventIndex(appState.activeEventIndex + 1, true);
      }
    }, 700);
  } else {
    if (playInterval) clearInterval(playInterval);
    playInterval = null;
  }
  renderApp();
}

export function togglePinSplit(): void {
  appState.isPinnedSplit = !appState.isPinnedSplit;
  if (appState.isPinnedSplit) {
    appState.pinnedFileIndex = appState.activeFileIndex;
    const file = getActiveFile();
    appState.pinnedLine = file.symbols[0]?.span.focusLine || 1;
    appState.pinnedSymbolKey = appState.activeSymbolKey;
  }
  renderApp();
}

export function setFollowMode(mode: FollowMode): void {
  appState.followMode = mode;
  renderApp();
}

export function setLens(lens: LensMode): void {
  appState.lens = lens;
  renderApp();
}

export function jumpToMilestone(type: 'intake' | 'dispatch' | 'crash' | 'reincarnation' | 'duplicate'): void {
  let targetIdx = 0;
  if (type === 'intake') targetIdx = 0;
  else if (type === 'dispatch') targetIdx = 10;
  else if (type === 'crash') targetIdx = 11;
  else if (type === 'reincarnation') targetIdx = 15;
  else if (type === 'duplicate') targetIdx = 19;

  setEventIndex(targetIdx);
}

// --- Keyboard Shortcuts Handler ---
function setupKeyboard(): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    // Ignore when typing in input
    if ((e.target instanceof HTMLInputElement && e.target.type !== 'range') || e.target instanceof HTMLTextAreaElement) {
      if (e.key === 'Escape') {
        commandPaletteOpen = false;
        renderApp();
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      commandPaletteOpen = !commandPaletteOpen;
      renderApp();
    } else if (e.key === '/') {
      e.preventDefault();
      document.querySelector<HTMLInputElement>('.atlas-search-input')?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setEventIndex(e.key === 'Home' ? 0 : traceEvents.length - 1);
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      togglePlayback();
    } else if (e.key === 'ArrowRight' || e.key === 'k' || e.key === 'l') {
      e.preventDefault();
      setEventIndex(appState.activeEventIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'h') {
      e.preventDefault();
      setEventIndex(appState.activeEventIndex - 1);
    } else if (e.key === ']' || e.key === 'PageDown') {
      e.preventDefault();
      setFileIndex(appState.activeFileIndex + 1);
    } else if (e.key === '[' || e.key === 'PageUp') {
      e.preventDefault();
      setFileIndex(appState.activeFileIndex - 1);
    } else if (e.key.toLowerCase() === 'p') {
      e.preventDefault();
      togglePinSplit();
    } else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      const modes: FollowMode[] = ['role', 'process', 'causal', 'free'];
      const cur = modes.indexOf(appState.followMode);
      setFollowMode(modes[(cur + 1) % modes.length]);
    } else if (e.key.toLowerCase() === 'x') {
      e.preventDefault();
      jumpToMilestone('crash');
    } else if (e.key.toLowerCase() === 'd') {
      e.preventDefault();
      jumpToMilestone('duplicate');
    } else if (e.key.toLowerCase() === 'e') {
      e.preventDefault();
      jumpToMilestone('dispatch');
    } else if (e.key === '1') {
      setLens('cockpit');
    } else if (e.key === '2') {
      setLens('cinema');
    } else if (e.key === '3') {
      setLens('review');
    } else if (e.key === '4') {
      setLens('compare');
    } else if (e.key === '5') {
      setLens('supervision');
    } else if (e.key === '6') {
      setLens('evidence');
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      commandPaletteOpen = !commandPaletteOpen;
      renderApp();
    } else if (e.key === '?') {
      e.preventDefault();
      shortcutsModalOpen = !shortcutsModalOpen;
      renderApp();
    } else if (e.key === 'Escape') {
      commandPaletteOpen = false;
      shortcutsModalOpen = false;
      renderApp();
    }
  });
}

// --- Render Functions ---

function renderHeader(): string {
  const ev = getActiveEvent();
  return `
    <header class="cockpit-top-bar">
      <div class="brand-zone">
        <div class="brand-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">ELIXIRSCOPE <span class="tag-v2">V2 COCKPIT</span></span>
          <span class="brand-sub">CAUSAL REVIEW &amp; BEAM CINEMA INSTRUMENT</span>
        </div>
      </div>

      <!-- Live Epistemic Gauge HUD -->
      <div class="epistemic-gauge-hud">
        <div class="hud-pill" title="Observed trace events in session">
          <span class="hud-dot dot-green"></span>
          <span class="hud-label">OBSERVED</span>
          <span class="hud-val">22</span>
        </div>
        <div class="hud-pill" title="Static analysis Reach/ExAST call edges">
          <span class="hud-dot dot-cyan"></span>
          <span class="hud-label">STATIC</span>
          <span class="hud-val">42</span>
        </div>
        <div class="hud-pill" title="Point-in-time state observations">
          <span class="hud-dot dot-purple"></span>
          <span class="hud-label">STATE PTS</span>
          <span class="hud-val">8</span>
        </div>
        <div class="hud-pill alert-gap" title="Critical epistemic gaps / unobserved outcomes">
          <span class="hud-dot dot-amber"></span>
          <span class="hud-label">GAPS</span>
          <span class="hud-val">2</span>
        </div>
        <div class="hud-pill" title="Target Elixir codebase files loaded">
          <span class="hud-dot dot-blue"></span>
          <span class="hud-label">CODEBASE</span>
          <span class="hud-val">${codebaseFiles.length} FILES</span>
        </div>
      </div>

      <!-- Lens Mode Switcher Tabs -->
      <nav class="lens-nav">
        <button class="lens-tab ${appState.lens === 'cockpit' ? 'active' : ''}" onclick="window.setLens('cockpit')">
          <span class="lens-num">1</span> COCKPIT
        </button>
        <button class="lens-tab ${appState.lens === 'cinema' ? 'active' : ''}" onclick="window.setLens('cinema')">
          <span class="lens-num">2</span> CINEMA
        </button>
        <button class="lens-tab ${appState.lens === 'review' ? 'active' : ''}" onclick="window.setLens('review')">
          <span class="lens-num">3</span> REVIEW DIFF
        </button>
        <button class="lens-tab ${appState.lens === 'compare' ? 'active' : ''}" onclick="window.setLens('compare')">
          <span class="lens-num">4</span> DUAL RUN
        </button>
        <button class="lens-tab ${appState.lens === 'supervision' ? 'active' : ''}" onclick="window.setLens('supervision')">
          <span class="lens-num">5</span> OTP BLAST
        </button>
        <button class="lens-tab ${appState.lens === 'evidence' ? 'active' : ''}" onclick="window.setLens('evidence')">
          <span class="lens-num">6</span> FINDINGS
        </button>
      </nav>

      <!-- Global Actions -->
      <div class="top-actions">
        <button class="action-btn" onclick="window.openPalette()" title="Command Palette (⌘K)">
          <kbd>⌘K</kbd>
        </button>
        <button class="action-btn" onclick="window.openShortcuts()" title="Hotkey Cheat Sheet (?)">
          <span>?</span>
        </button>
      </div>
    </header>
  `;
}

function renderScrubberDeck(): string {
  const ev = getActiveEvent();
  const progressPercent = ((appState.activeEventIndex) / (traceEvents.length - 1)) * 100;

  return `
    <div class="master-scrubber-deck">
      <div class="transport-controls">
        <button class="scrub-btn" onclick="window.setEventIndex(0)" title="Jump to Start (Home)">⏮</button>
        <button class="scrub-btn" onclick="window.setEventIndex(${appState.activeEventIndex - 1})" title="Step Back (H / J / ←)">◀</button>
        <button class="scrub-btn play-pause-btn ${isPlaying ? 'playing' : ''}" onclick="window.togglePlayback()" title="Play / Pause (Space)">
          ${isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>
        <button class="scrub-btn" onclick="window.setEventIndex(${appState.activeEventIndex + 1})" title="Step Forward (L / K / →)">▶</button>
        <button class="scrub-btn" onclick="window.setEventIndex(${traceEvents.length - 1})" title="Jump to End (End)">⏭</button>
      </div>

      <!-- Quick Causal Milestones Fast-Jump -->
      <div class="milestone-jump-bar">
        <button class="milestone-pill ${appState.activeEventIndex === 0 ? 'active' : ''}" onclick="window.jumpToMilestone('intake')" title="Event 1: Ingress Intake">
          <span class="pill-dot dot-blue"></span> 01 INTAKE
        </button>
        <button class="milestone-pill ${appState.activeEventIndex === 10 ? 'active' : ''}" onclick="window.jumpToMilestone('dispatch')" title="Event 11: HTTP Dispatch Attempt #1">
          <span class="pill-dot dot-amber"></span> 11 GATEWAY #1
        </button>
        <button class="milestone-pill ${appState.activeEventIndex === 11 ? 'active' : ''}" onclick="window.jumpToMilestone('crash')" title="Event 12: Worker Kill Crash Site (X)">
          <span class="pill-dot dot-red"></span> 12 CRASH SITE (X)
        </button>
        <button class="milestone-pill ${appState.activeEventIndex === 15 ? 'active' : ''}" onclick="window.jumpToMilestone('reincarnation')" title="Event 16: Worker Incarnation #2 Spawn">
          <span class="pill-dot dot-cyan"></span> 16 REINCARNATION
        </button>
        <button class="milestone-pill alert-pill ${appState.activeEventIndex === 19 ? 'active' : ''}" onclick="window.jumpToMilestone('duplicate')" title="Event 20: Duplicate HTTP Dispatch Hazard! (D)">
          <span class="pill-dot dot-amber-pulse"></span> 20 DUPLICATE WRITE (D)
        </button>
      </div>

      <!-- High-Frequency Continuous Scrubber Range -->
      <div class="scrubber-range-container">
        <div class="scrubber-track-waveform">
          ${traceEvents.map((e, idx) => {
            let color = '#38bdf8';
            if (e.eventType.includes('crash') || e.eventType.includes('exit')) color = '#f87171';
            else if (e.eventType.includes('effect') || e.eventType.includes('warning')) color = '#fbbf24';
            else if (e.eventType.includes('journal')) color = '#34d399';
            else if (e.eventType.includes('spawn') || e.eventType.includes('reincarnation')) color = '#a78bfa';

            return `
              <div 
                class="event-pip ${idx === appState.activeEventIndex ? 'is-active' : ''}"
                style="left: ${(idx / (traceEvents.length - 1)) * 100}%; background: ${color};"
                onclick="window.setEventIndex(${idx})"
                title="${e.timeDisplay} · ${escapeHtml(e.title)}"
              ></div>
            `;
          }).join('')}
          <div class="scrub-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <input 
          type="range" 
          min="0" 
          max="${traceEvents.length - 1}" 
          value="${appState.activeEventIndex}"
          class="master-scrub-input" 
          aria-label="Scrub recorded execution" oninput="window.setEventIndex(parseInt(this.value, 10), true)"
        />
      </div>

      <!-- Active Position HUD Badge -->
      <div class="scrub-hud-info">
        <span class="scrub-time">${ev.timeDisplay}</span>
        <span class="scrub-step">STEP ${String(ev.seq).padStart(2, '0')}/${String(traceEvents.length).padStart(2, '0')}</span>
        <span class="scrub-role">${escapeHtml(ev.logicalRoleId)}</span>
        <span class="scrub-pid">${escapeHtml(ev.processInstanceId.split('/').pop())}</span>
      </div>

      <!-- Follow Mode Toggle -->
      <div class="follow-mode-selector">
        <span class="follow-label">FOLLOW:</span>
        <button class="follow-pill ${appState.followMode === 'role' ? 'active' : ''}" onclick="window.setFollowMode('role')" title="Follow logical role across restarts">ROLE</button>
        <button class="follow-pill ${appState.followMode === 'process' ? 'active' : ''}" onclick="window.setFollowMode('process')" title="Follow strictly single process incarnation">PROCESS</button>
        <button class="follow-pill ${appState.followMode === 'causal' ? 'active' : ''}" onclick="window.setFollowMode('causal')" title="Follow causal happens-before graph">CAUSAL</button>
        <button class="follow-pill ${appState.followMode === 'free' ? 'active' : ''}" onclick="window.setFollowMode('free')" title="Free manual navigation">FREE</button>
      </div>

      <!-- Split Pin Toggle -->
      <button class="pin-toggle-btn ${appState.isPinnedSplit ? 'active' : ''}" onclick="window.togglePinSplit()" title="Pin split baseline code viewer (P)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="17" x2="12" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
        </svg>
        <span>${appState.isPinnedSplit ? 'PINNED SPLIT ON' : 'PIN BASELINE (P)'}</span>
      </button>
    </div>
  `;
}

function renderCodebaseAtlas(): string {
  const activeFile = getActiveFile();
  const filtered = fileSearchQuery 
    ? codebaseFiles.filter(f => f.path.toLowerCase().includes(fileSearchQuery.toLowerCase()) || f.module.toLowerCase().includes(fileSearchQuery.toLowerCase()))
    : codebaseFiles;

  return `
    <section class="codebase-atlas-strip">
      <div class="atlas-header">
        <div class="atlas-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>CODEBASE ATLAS &mdash; 24 OTP SOURCE UNITS</span>
        </div>
        <div class="atlas-filter">
          <input 
            type="text" 
            placeholder="Filter 24 files... (/)" 
            value="${escapeHtml(fileSearchQuery)}"
            oninput="window.setFileFilter(this.value)"
            class="atlas-search-input"
          />
        </div>
      </div>

      <div class="atlas-grid">
        ${filtered.map((file, i) => {
          const originalIdx = codebaseFiles.indexOf(file);
          const isActive = originalIdx === appState.activeFileIndex;
          const isPinned = appState.isPinnedSplit && originalIdx === appState.pinnedFileIndex;
          let badgeCls = 'tag-infra';
          if (file.changeStatus === 'MODIFIED') badgeCls = 'tag-mod';
          else if (file.changeStatus === 'EFFECT_FRONTIER') badgeCls = 'tag-frontier';
          else if (file.changeStatus === 'TEST_LEAD') badgeCls = 'tag-lead';
          else if (file.changeStatus === 'CALLER') badgeCls = 'tag-caller';

          return `
            <div 
              class="atlas-card ${isActive ? 'is-active-file' : ''} ${isPinned ? 'is-pinned-file' : ''}" 
              onclick="window.setFileIndex(${originalIdx})"
              title="${escapeHtml(file.path)} (${file.loc} LOC) &mdash; ${escapeHtml(file.diffSummary || '')}"
            >
              <div class="card-top">
                <span class="file-name">${escapeHtml(file.path.split('/').pop())}</span>
                <span class="badge ${badgeCls}">${file.changeStatus}</span>
              </div>
              <div class="card-mid">
                <span class="module-name">${escapeHtml(file.module)}</span>
              </div>
              <div class="card-bottom">
                <span class="subsys-tag">${file.subsystem.toUpperCase()}</span>
                <span class="loc-tag">${file.loc} L</span>
                ${file.eventIds.length > 0 ? `<span class="event-count-pill">${file.eventIds.length} EV</span>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderCodeViewerPane(file: FileItem, isPinned = false): string {
  const activeEv = getActiveEvent();
  const isTargetOfEvent = !isPinned && activeEv.sourceRef?.filePath === file.path;
  const activeFocusLine = isTargetOfEvent ? activeEv.sourceRef.span.focusLine : null;

  return `
    <div class="code-viewer-pane ${isPinned ? 'is-pinned-pane' : ''}">
      <div class="pane-header">
        <div class="pane-title-group">
          <span class="pane-indicator ${isPinned ? 'dot-pinned' : 'dot-active'}"></span>
          <span class="pane-mode-label">${isPinned ? 'PINNED BASELINE' : 'LIVE CODE FOLLOWER'}</span>
          <span class="file-path-label">${escapeHtml(file.path)}</span>
          <span class="module-badge">${escapeHtml(file.module)}</span>
        </div>
        <div class="pane-meta-group">
          <span class="status-badge ${file.changeStatus === 'MODIFIED' ? 'badge-mod' : 'badge-infra'}">
            ${file.changeStatus}
          </span>
          <span class="loc-badge">${file.loc} LOC</span>
        </div>
      </div>

      <div class="code-scroller">
        <table class="code-table">
          <tbody>
            ${file.lines.map(line => {
              const isLineActive = activeFocusLine === line.num;
              const hasAnnotation = !!line.annotation;

              let lineCls = `diff-${line.diffStatus}`;
              if (isLineActive) lineCls += ' is-active-line';

              return `
                <tr class="code-line ${lineCls}">
                  <td class="gutter-old">${line.oldNum !== undefined ? line.oldNum : ''}</td>
                  <td class="gutter-new">${line.num !== undefined ? line.num : ''}</td>
                  <td class="gutter-marker">${line.diffStatus === 'add' ? '+' : line.diffStatus === 'remove' ? '-' : isLineActive ? '▶' : ' '}</td>
                  <td class="code-content">
                    <pre><code>${highlightSyntax(line.text)}</code></pre>
                    ${hasAnnotation && line.annotation ? `
                      <div class="inline-evidence-chip chip-${line.annotation.kind}">
                        <span class="chip-badge">${escapeHtml(line.annotation.badge)}</span>
                        <strong class="chip-label">${escapeHtml(line.annotation.label)}:</strong>
                        <span class="chip-detail">${escapeHtml(line.annotation.detail)}</span>
                      </div>
                    ` : ''}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCausalPianoRoll(): string {
  const activeEv = getActiveEvent();
  const width = 1100;
  const height = 240;
  const laneHeight = 28;
  const numEvents = traceEvents.length;

  return `
    <div class="causal-piano-roll-widget">
      <div class="piano-roll-header">
        <div class="piano-roll-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>SYSTEM SCORE &amp; CAUSAL PIANO ROLL &mdash; 3 BEAM NODES &middot; 7 PROCESS LIFELINES</span>
        </div>
        <div class="piano-roll-legend">
          <span class="legend-item"><span class="legend-swatch" style="background:#38bdf8;"></span> Ingress</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#818cf8;"></span> Coordinator</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#f87171;"></span> Worker #1 (Dead)</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#2dd4bf;"></span> Worker #2 (Reincarnated)</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#34d399;"></span> Journal</span>
          <span class="legend-item"><span class="legend-swatch" style="background:#fbbf24;"></span> Effect Frontier</span>
        </div>
      </div>

      <div class="piano-roll-body">
        <!-- Process swimlane labels -->
        <div class="swimlane-labels">
          ${processIncarnations.map(p => `
            <div class="lane-label" style="height:${laneHeight}px;">
              <span class="lane-node">${p.nodeInstanceId.split('-')[1].toUpperCase()}</span>
              <span class="lane-role">${p.logicalRoleId}</span>
              <span class="lane-pid">${p.pidRepr}</span>
            </div>
          `).join('')}
          <div class="lane-label" style="height:${laneHeight}px;">
            <span class="lane-node">EXT</span>
            <span class="lane-role">gateway_api</span>
            <span class="lane-pid">tcp:443</span>
          </div>
        </div>

        <!-- SVG Timeline Surface -->
        <div class="svg-surface-wrap">
          <svg viewBox="0 0 ${width} ${height}" class="piano-roll-svg" preserveAspectRatio="none">
            <!-- Gridlines -->
            ${processIncarnations.map((_, i) => `
              <line x1="0" y1="${i * laneHeight + laneHeight / 2}" x2="${width}" y2="${i * laneHeight + laneHeight / 2}" stroke="#1e293b" stroke-width="1" />
            `).join('')}
            <line x1="0" y1="${7 * laneHeight + laneHeight / 2}" x2="${width}" y2="${7 * laneHeight + laneHeight / 2}" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 4" />

            <!-- Process Lifelines -->
            <!-- Worker 1 lifeline: Starts at event 6, dies at event 12 -->
            <line 
              x1="${(5 / (numEvents - 1)) * (width - 40) + 20}" 
              y1="${3 * laneHeight + laneHeight / 2}" 
              x2="${(12 / (numEvents - 1)) * (width - 40) + 20}" 
              y2="${3 * laneHeight + laneHeight / 2}" 
              stroke="#f87171" 
              stroke-width="3" 
            />
            <!-- Worker 1 Crash marker -->
            <text x="${(12 / (numEvents - 1)) * (width - 40) + 20}" y="${3 * laneHeight + laneHeight / 2 + 5}" fill="#f87171" font-size="14" font-weight="bold" text-anchor="middle">✕</text>

            <!-- Worker 2 lifeline: Starts at event 15 onwards -->
            <line 
              x1="${(15 / (numEvents - 1)) * (width - 40) + 20}" 
              y1="${4 * laneHeight + laneHeight / 2}" 
              x2="${width - 20}" 
              y2="${4 * laneHeight + laneHeight / 2}" 
              stroke="#2dd4bf" 
              stroke-width="3" 
            />

            <!-- Causal vectors between processes -->
            <!-- Msg 1: Ingress -> Coord -->
            <path d="M ${(3 / (numEvents - 1)) * (width - 40) + 20} ${0 * laneHeight + laneHeight / 2} Q ${(3.5 / (numEvents - 1)) * (width - 40) + 20} ${0.5 * laneHeight + laneHeight / 2} ${(4 / (numEvents - 1)) * (width - 40) + 20} ${1 * laneHeight + laneHeight / 2}" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3" />
            
            <!-- Msg 2: Coord -> Worker 1 -->
            <path d="M ${(4 / (numEvents - 1)) * (width - 40) + 20} ${1 * laneHeight + laneHeight / 2} L ${(6 / (numEvents - 1)) * (width - 40) + 20} ${3 * laneHeight + laneHeight / 2}" fill="none" stroke="#818cf8" stroke-width="1.5" />

            <!-- Crash to Sup DOWN -->
            <path d="M ${(12 / (numEvents - 1)) * (width - 40) + 20} ${3 * laneHeight + laneHeight / 2} L ${(13 / (numEvents - 1)) * (width - 40) + 20} ${2 * laneHeight + laneHeight / 2}" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="2 2" />

            <!-- Sup restart to Worker 2 spawn -->
            <path d="M ${(14 / (numEvents - 1)) * (width - 40) + 20} ${2 * laneHeight + laneHeight / 2} L ${(15 / (numEvents - 1)) * (width - 40) + 20} ${4 * laneHeight + laneHeight / 2}" fill="none" stroke="#c084fc" stroke-width="2" />

            <!-- Attempt #1 Gateway write (Worker 1 -> External) -->
            <line x1="${(10 / (numEvents - 1)) * (width - 40) + 20}" y1="${3 * laneHeight + laneHeight / 2}" x2="${(10 / (numEvents - 1)) * (width - 40) + 20}" y2="${7 * laneHeight + laneHeight / 2}" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 2" />

            <!-- Attempt #2 Gateway write (Worker 2 -> External) -->
            <line x1="${(19 / (numEvents - 1)) * (width - 40) + 20}" y1="${4 * laneHeight + laneHeight / 2}" x2="${(19 / (numEvents - 1)) * (width - 40) + 20}" y2="${7 * laneHeight + laneHeight / 2}" stroke="#fbbf24" stroke-width="2.5" />

            <!-- Active Cursor Bar -->
            <line 
              x1="${(appState.activeEventIndex / (numEvents - 1)) * (width - 40) + 20}" 
              y1="0" 
              x2="${(appState.activeEventIndex / (numEvents - 1)) * (width - 40) + 20}" 
              y2="${height}" 
              stroke="#60a5fa" 
              stroke-width="2" 
              stroke-dasharray="4 2" 
            />

            <!-- Event Ticks on Swimlanes -->
            ${traceEvents.map((e, idx) => {
              let laneIdx = 0;
              if (e.logicalRoleId === 'ingress') laneIdx = 0;
              else if (e.logicalRoleId === 'coordinator') laneIdx = 1;
              else if (e.logicalRoleId === 'worker_supervisor') laneIdx = 2;
              else if (e.logicalRoleId === 'worker-cmd-42' && e.processInstanceId.includes('worker-pid1')) laneIdx = 3;
              else if (e.logicalRoleId === 'worker-cmd-42' && e.processInstanceId.includes('worker-pid2')) laneIdx = 4;
              else if (e.logicalRoleId === 'journal') laneIdx = 5;
              else if (e.logicalRoleId === 'ledger') laneIdx = 6;

              const cx = (idx / (numEvents - 1)) * (width - 40) + 20;
              const cy = laneIdx * laneHeight + laneHeight / 2;
              const isSelected = idx === appState.activeEventIndex;

              let fill = '#38bdf8';
              if (e.eventType.includes('crash') || e.eventType.includes('exit')) fill = '#f87171';
              else if (e.eventType.includes('effect')) fill = '#fbbf24';
              else if (e.eventType.includes('journal')) fill = '#34d399';
              else if (e.eventType.includes('reincarnation') || e.eventType.includes('spawn')) fill = '#a78bfa';

              return `
                <g class="event-node-group" onclick="window.setEventIndex(${idx})">
                  ${isSelected ? `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#60a5fa" stroke-width="2" class="cursor-glow" />` : ''}
                  <circle cx="${cx}" cy="${cy}" r="${isSelected ? 5.5 : 4}" fill="${fill}" stroke="#0f172a" stroke-width="1.5" />
                </g>
              `;
            }).join('')}
          </svg>
        </div>
      </div>
    </div>
  `;
}

function renderDiagnosticInspector(): string {
  const ev = getActiveEvent();

  return `
    <div class="diagnostic-inspector-pane">
      <div class="inspector-tabs-header">
        <span class="inspector-title">TELEMETRY &amp; STATE TRIAD</span>
        <span class="active-event-badge">${ev.timeDisplay} &middot; EV #${ev.seq}</span>
      </div>

      <div class="inspector-content">
        <!-- 1. Active Event Headline Card -->
        <div class="event-summary-card">
          <div class="card-status-bar ${ev.eventType.includes('crash') ? 'bar-red' : ev.eventType.includes('effect') ? 'bar-amber' : 'bar-blue'}"></div>
          <div class="event-type-badge">${escapeHtml(ev.eventType)}</div>
          <h3 class="event-headline">${escapeHtml(ev.headline)}</h3>
          <p class="event-notes">${escapeHtml(ev.notes || '')}</p>
          <div class="event-meta-tags">
            <span class="meta-tag">NODE: ${escapeHtml(ev.nodeInstanceId)}</span>
            <span class="meta-tag">PID: ${escapeHtml(ev.processInstanceId.split('/').pop())}</span>
            <span class="meta-tag">CORR: ${escapeHtml(ev.correlationId)}</span>
            ${ev.seqTraceToken ? `<span class="meta-tag tag-token">TOKEN: ${escapeHtml(ev.seqTraceToken)}</span>` : ''}
          </div>
        </div>

        <!-- 2. GenServer State Filmstrip & Diff -->
        <div class="diagnostic-box">
          <div class="box-title">
            <span>GENSERVER STATE OBSERVATION</span>
            <span class="status-chip ${ev.stateObservation ? 'chip-observed' : 'chip-none'}">
              ${ev.stateObservation ? ev.stateObservation.completeness.toUpperCase() : 'NO SNAPSHOT'}
            </span>
          </div>
          ${ev.stateObservation ? `
            <div class="state-fields-table">
              ${Object.entries(ev.stateObservation.fields).map(([k, v]) => {
                const diff = ev.stateObservation?.diffs?.[k];
                return `
                  <div class="state-row ${diff ? 'is-mutated' : ''}">
                    <span class="state-key">${escapeHtml(k)}:</span>
                    <span class="state-val">
                      ${diff ? `<span class="val-old">${escapeHtml(diff.from)}</span> &rarr; <span class="val-new">${escapeHtml(diff.to)}</span>` : escapeHtml(JSON.stringify(v))}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
            ${ev.stateObservation.unrecordedGap ? `
              <div class="epistemic-gap-alert">
                <strong>EPISTEMIC GAP:</strong> ${escapeHtml(ev.stateObservation.unrecordedGap)}
              </div>
            ` : ''}
          ` : `
            <div class="no-data-msg">No state snapshot captured at this local sequence tick.</div>
          `}
        </div>

        <!-- 3. Effect Frontier & External Mutation Hazard -->
        <div class="diagnostic-box">
          <div class="box-title">
            <span>EFFECT FRONTIER &amp; MUTATION LEDGER</span>
            <span class="status-chip ${ev.effectRecord ? 'chip-frontier' : 'chip-none'}">
              ${ev.effectRecord ? ev.effectRecord.status.toUpperCase() : 'NO EXTERNAL IO'}
            </span>
          </div>
          ${ev.effectRecord ? `
            <div class="effect-details">
              <div class="effect-row">
                <span class="eff-label">OPERATION:</span>
                <span class="eff-val font-mono">${escapeHtml(ev.effectRecord.operation)}</span>
              </div>
              <div class="effect-row">
                <span class="eff-label">TARGET:</span>
                <span class="eff-val">${escapeHtml(ev.effectRecord.target)}</span>
              </div>
              <div class="effect-row">
                <span class="eff-label">ATTEMPT:</span>
                <span class="eff-val font-bold">#${ev.effectRecord.attemptNumber}</span>
              </div>
              <div class="effect-row">
                <span class="eff-label">DIGEST:</span>
                <span class="eff-val font-mono text-xs">${escapeHtml(ev.effectRecord.payloadDigest)}</span>
              </div>
              ${ev.effectRecord.hazardNote ? `
                <div class="hazard-callout">
                  <strong>CONCURRENCY HAZARD:</strong> ${escapeHtml(ev.effectRecord.hazardNote)}
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="no-data-msg">No outbound external side effect attempted at this step.</div>
          `}
        </div>

        <!-- 4. Mailbox Anatomy -->
        <div class="diagnostic-box">
          <div class="box-title">
            <span>PROCESS MAILBOX WATERLINE</span>
            <span class="status-chip">${ev.mailboxState ? `${ev.mailboxState.queueDepth} MSG` : 'EMPTY'}</span>
          </div>
          ${ev.mailboxState && ev.mailboxState.messages.length > 0 ? `
            <div class="mailbox-items">
              ${ev.mailboxState.messages.map(m => `
                <div class="mailbox-msg-item">
                  <div class="msg-type font-mono">${escapeHtml(m.msgType)}</div>
                  <div class="msg-preview text-xs">${escapeHtml(m.payloadPreview)}</div>
                  <div class="msg-sender text-xs">from: ${escapeHtml(m.senderPid)} &middot; ${escapeHtml(m.status)}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="no-data-msg">Mailbox queue depth is 0; process is not backpressured.</div>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderCompareLens(): string {
  return `
    <div class="compare-lens-container">
      <div class="compare-header">
        <h2>DUAL-RUN DIVERGENCE &amp; COUNTEREXAMPLE ALIGNMENT</h2>
        <p>Comparing <strong>Run A [Passing Baseline]</strong> versus <strong>Run B [Failing PR #248 Witness]</strong> aligned by semantic milestones.</p>
      </div>

      <div class="milestones-table-wrap">
        <table class="milestones-table">
          <thead>
            <tr>
              <th>MILESTONE PHASE</th>
              <th>SEMANTIC SYMBOL</th>
              <th>RUN A (PASS)</th>
              <th>RUN B (FAIL)</th>
              <th>MATCH BASIS</th>
              <th>DIVERGENCE VERDICT</th>
            </tr>
          </thead>
          <tbody>
            ${comparisonMilestones.map(m => {
              const isDiverged = m.divergenceType !== 'identical';
              return `
                <tr class="milestone-row ${isDiverged ? 'is-diverged-row' : ''}">
                  <td class="font-bold">${escapeHtml(m.phaseName)}</td>
                  <td class="font-mono text-xs">${escapeHtml(m.symbol)}</td>
                  <td><span class="badge ${m.runAStatus === 'observed' ? 'badge-green' : 'badge-gray'}">${m.runAStatus.toUpperCase()}</span></td>
                  <td><span class="badge ${m.runBStatus === 'observed' ? 'badge-green' : m.runBStatus === 'crash' ? 'badge-red' : 'badge-amber'}">${m.runBStatus.toUpperCase()}</span></td>
                  <td class="text-xs font-mono">${escapeHtml(m.matchBasis)}</td>
                  <td>
                    ${isDiverged ? `
                      <span class="divergence-alert">
                        <strong>${m.divergenceType?.toUpperCase()}:</strong> ${escapeHtml(m.notes)}
                      </span>
                    ` : `
                      <span class="text-muted text-xs">Identical behavior verified.</span>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSupervisionLens(): string {
  return `
    <div class="supervision-lens-container">
      <div class="supervision-header">
        <h2>OTP SUPERVISION TREE &amp; RESTART BLAST RADIUS</h2>
        <p>Dynamic process incarnation tracking and supervisor escalation limits.</p>
      </div>

      <div class="supervision-cards-grid">
        ${initialSupervisionNodes.map(node => `
          <div class="supervision-card">
            <div class="sup-card-top">
              <span class="sup-type-tag">${node.type.toUpperCase()}</span>
              <span class="sup-strategy">${node.strategy || ':worker'}</span>
            </div>
            <h3 class="sup-name">${escapeHtml(node.name)}</h3>
            <div class="sup-metrics">
              <div class="metric-row">
                <span>RESTART BUDGET:</span>
                <strong>${node.maxRestarts ? `${node.restartsObserved} of ${node.maxRestarts} (${node.maxSeconds}s window)` : 'N/A'}</strong>
              </div>
              <div class="metric-row">
                <span>ACTIVE CHILDREN:</span>
                <strong>${node.activeChildren}</strong>
              </div>
            </div>

            <div class="incarnation-trail">
              <span class="trail-label">INCARNATION HISTORY:</span>
              ${node.incarnationHistory.map(inc => `
                <div class="inc-pill font-mono">${escapeHtml(inc)}</div>
              `).join('')}
            </div>

            ${node.blastRadius.length > 0 ? `
              <div class="blast-radius-box">
                <span class="blast-label">BLAST RADIUS ON CRASH:</span>
                <div class="blast-items">
                  ${node.blastRadius.map(b => `<span class="blast-chip">${escapeHtml(b)}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFindingsLens(): string {
  return `
    <div class="findings-lens-container">
      <div class="findings-header">
        <div class="findings-title-group">
          <h2>EVIDENCE-BACKED REVIEW FINDINGS</h2>
          <p>Uncertainty-qualified conclusions with exact source anchors, observed facts, and unresolved gaps.</p>
        </div>
        <button class="export-btn" onclick="window.exportInvestigation()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          EXPORT INVESTIGATION BUNDLE (JSON)
        </button>
      </div>

      <div class="findings-grid">
        ${findingsList.map(f => `
          <div class="finding-card finding-${f.severity}">
            <div class="finding-card-top">
              <span class="finding-id">${f.id}</span>
              <span class="finding-severity severity-${f.severity}">${f.severity.toUpperCase()}</span>
              <span class="finding-status status-${f.status}">${f.status.replace('_', ' ').toUpperCase()}</span>
            </div>
            <h3 class="finding-title">${escapeHtml(f.title)}</h3>
            <p class="finding-claim">${escapeHtml(f.claim)}</p>

            <div class="finding-section">
              <span class="section-heading">SOURCE &amp; EVENT ANCHORS:</span>
              <div class="anchor-pills">
                ${f.anchors.map(a => `
                  <div class="anchor-pill">
                    <span class="anchor-file">${escapeHtml(a.filePath.split('/').pop())}</span>
                    <span class="anchor-sym font-mono">${escapeHtml(a.symbol)}</span>
                    <span class="anchor-range">${escapeHtml(a.lineRange)}</span>
                    ${a.eventId ? `<span class="anchor-ev">${escapeHtml(a.eventId)}</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="finding-section">
              <span class="section-heading">EVIDENCE BASES:</span>
              <ul class="evidence-list">
                ${f.evidencePoints.map(ep => `
                  <li class="evidence-item kind-${ep.kind}">
                    <span class="kind-tag">${ep.kind.toUpperCase()}</span>
                    <span>${escapeHtml(ep.summary)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="finding-section gap-section">
              <span class="section-heading text-amber">UNRESOLVED GAPS &amp; CAVEATS:</span>
              <ul class="gaps-list">
                ${f.unresolvedGaps.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderModals(): string {
  if (commandPaletteOpen) {
    return `
      <div class="modal-backdrop" onclick="window.closePalette()">
        <div class="command-palette-modal" onclick="event.stopPropagation()">
          <div class="palette-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Type command or jump to file/milestone... (ESC to close)" 
              class="palette-input" 
              autofocus 
              id="cmd-input"
            />
          </div>
          <div class="palette-results">
            <div class="palette-group">NAVIGATION JUMPS</div>
            <div class="palette-item" onclick="window.jumpToMilestone('crash'); window.closePalette();">
              <span>Seek to Crash Site (Process.exit :kill)</span>
              <kbd>X</kbd>
            </div>
            <div class="palette-item" onclick="window.jumpToMilestone('duplicate'); window.closePalette();">
              <span>Seek to Duplicate Gateway Mutation Hazard</span>
              <kbd>D</kbd>
            </div>
            <div class="palette-item" onclick="window.jumpToMilestone('dispatch'); window.closePalette();">
              <span>Seek to Attempt #1 External Write</span>
              <kbd>E</kbd>
            </div>
            <div class="palette-group">LENS SWITCHING</div>
            <div class="palette-item" onclick="window.setLens('cockpit'); window.closePalette();">
              <span>Lens 1: Causal Code Cockpit</span>
              <kbd>1</kbd>
            </div>
            <div class="palette-item" onclick="window.setLens('compare'); window.closePalette();">
              <span>Lens 4: Dual-Run Divergence Matrix</span>
              <kbd>4</kbd>
            </div>
            <div class="palette-item" onclick="window.setLens('supervision'); window.closePalette();">
              <span>Lens 5: OTP Supervision Blast Radius</span>
              <kbd>5</kbd>
            </div>
            <div class="palette-item" onclick="window.togglePinSplit(); window.closePalette();">
              <span>Toggle Pinned Baseline Split Mode</span>
              <kbd>P</kbd>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (shortcutsModalOpen) {
    return `
      <div class="modal-backdrop" onclick="window.closeShortcuts()">
        <div class="shortcuts-modal" onclick="event.stopPropagation()">
          <div class="shortcuts-header">
            <h3>KEYBOARD NAVIGATION CHEAT SHEET</h3>
            <button class="close-btn" onclick="window.closeShortcuts()">&times;</button>
          </div>
          <div class="shortcuts-grid">
            <div class="shortcut-item"><kbd>Space</kbd> <span>Play / Pause Scrubber Playback</span></div>
            <div class="shortcut-item"><kbd>&larr;</kbd> / <kbd>&rarr;</kbd> or <kbd>J</kbd> / <kbd>K</kbd> <span>Step Trace Event Backward / Forward</span></div>
            <div class="shortcut-item"><kbd>[</kbd> / <kbd>]</kbd> <span>Previous / Next File across 24 Codebase Units</span></div>
            <div class="shortcut-item"><kbd>P</kbd> <span>Toggle Pinned Baseline Split Screen</span></div>
            <div class="shortcut-item"><kbd>F</kbd> <span>Cycle Follow Mode (Role &rarr; Process &rarr; Causal &rarr; Free)</span></div>
            <div class="shortcut-item"><kbd>X</kbd> <span>Fast Jump to Worker Kill Crash Site</span></div>
            <div class="shortcut-item"><kbd>D</kbd> <span>Fast Jump to Duplicate External Write Hazard</span></div>
            <div class="shortcut-item"><kbd>E</kbd> <span>Fast Jump to Effect Frontier Attempt #1</span></div>
            <div class="shortcut-item"><kbd>1</kbd> - <kbd>6</kbd> <span>Switch Main View Lenses</span></div>
            <div class="shortcut-item"><kbd>⌘K</kbd> <span>Open Command &amp; Symbol Palette</span></div>
            <div class="shortcut-item"><kbd>/</kbd> <span>Focus Codebase Atlas Search Filter</span></div>
            <div class="shortcut-item"><kbd>Esc</kbd> <span>Close Modals / Overlays</span></div>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

export function renderApp(preserveDeck = false): void {
  const root = document.getElementById('app');
  if (!root) return;

  const activeFile = getActiveFile();
  const pinnedFile = getPinnedFile();

  let mainContent = '';

  if (appState.lens === 'cockpit' || appState.lens === 'review' || appState.lens === 'cinema') {
    mainContent = `
      <!-- Codebase Atlas File Strip (24 files) -->
      ${renderCodebaseAtlas()}

      <!-- Causal Piano Roll / System Score -->
      ${renderCausalPianoRoll()}

      <!-- Central Code Review & Telemetry Split Screen -->
      <div class="cockpit-split-workbench ${appState.isPinnedSplit ? 'is-split-active' : ''}">
        ${appState.isPinnedSplit ? `
          <!-- Left: Pinned Baseline Code -->
          <div class="workbench-column col-pinned">
            ${renderCodeViewerPane(pinnedFile, true)}
          </div>
        ` : ''}

        <!-- Live Code Viewer -->
        <div class="workbench-column col-live">
          ${renderCodeViewerPane(activeFile, false)}
        </div>

        <!-- Right: Diagnostic & State Triad -->
        <div class="workbench-column col-inspector">
          ${renderDiagnosticInspector()}
        </div>
      </div>
    `;
  } else if (appState.lens === 'compare') {
    mainContent = renderCompareLens();
  } else if (appState.lens === 'supervision') {
    mainContent = renderSupervisionLens();
  } else if (appState.lens === 'evidence') {
    mainContent = renderFindingsLens();
  }

  const focused = document.activeElement as HTMLInputElement;
  const restoreSearch = focused?.classList.contains('atlas-search-input');
  const selection = restoreSearch ? focused.selectionStart : null;
  const scrubber = root.querySelector<HTMLInputElement>('.master-scrub-input');
  const atlasScroll = root.querySelector('.atlas-grid')?.scrollLeft || 0;

  const markup = `
    <div class="cockpit-root">
      ${renderHeader()}
      ${renderScrubberDeck()}
      <main class="cockpit-main-viewport">
        ${mainContent}
      </main>
      ${renderModals()}
    </div>
  `;
  if (preserveDeck && root.querySelector('.master-scrubber-deck')) {
    const next = document.createElement('div');
    next.innerHTML = markup;
    root.querySelector('.cockpit-main-viewport')!.innerHTML = next.querySelector('.cockpit-main-viewport')!.innerHTML;
    for (const selector of ['.transport-controls', '.milestone-jump-bar', '.scrub-hud-info']) {
      root.querySelector(selector)!.innerHTML = next.querySelector(selector)!.innerHTML;
    }
    root.querySelector<HTMLElement>('.scrub-progress-fill')!.style.width = `${appState.activeEventIndex / (traceEvents.length - 1) * 100}%`;
    root.querySelectorAll('.event-pip').forEach((pip, i) => pip.classList.toggle('is-active', i === appState.activeEventIndex));
    if (scrubber) scrubber.value = String(appState.activeEventIndex);
  } else {
    root.innerHTML = markup;
  }
  // Keep the native range attached throughout a drag to retain pointer capture.
  const newScrubber = root.querySelector<HTMLInputElement>('.master-scrub-input');
  if (scrubber && newScrubber && !preserveDeck) {
    scrubber.value = String(appState.activeEventIndex);
    newScrubber.replaceWith(scrubber);
  }
  const atlas = root.querySelector('.atlas-grid');
  if (atlas) atlas.scrollLeft = atlasScroll;
  if (restoreSearch) {
    const input = root.querySelector<HTMLInputElement>('.atlas-search-input');
    input?.focus();
    if (selection !== null) input?.setSelectionRange(selection, selection);
  }
  if (commandPaletteOpen) root.querySelector<HTMLInputElement>('#cmd-input')?.focus();
  const line = root.querySelector<HTMLElement>('.col-live .is-active-line');
  const scroller = root.querySelector<HTMLElement>('.col-live .code-scroller');
  if (line && scroller) scroller.scrollTop = line.offsetTop - scroller.offsetTop - scroller.clientHeight / 2;
}

// Window global bindings for inline HTML handlers
(window as unknown as Record<string, unknown>).setEventIndex = setEventIndex;
(window as unknown as Record<string, unknown>).setFileIndex = setFileIndex;
(window as unknown as Record<string, unknown>).togglePlayback = togglePlayback;
(window as unknown as Record<string, unknown>).togglePinSplit = togglePinSplit;
(window as unknown as Record<string, unknown>).setFollowMode = setFollowMode;
(window as unknown as Record<string, unknown>).setLens = setLens;
(window as unknown as Record<string, unknown>).jumpToMilestone = jumpToMilestone;
(window as unknown as Record<string, unknown>).setFileFilter = (val: string) => {
  fileSearchQuery = val;
  renderApp();
};
(window as unknown as Record<string, unknown>).openPalette = () => {
  commandPaletteOpen = true;
  renderApp();
  setTimeout(() => document.getElementById('cmd-input')?.focus(), 50);
};
(window as unknown as Record<string, unknown>).closePalette = () => {
  commandPaletteOpen = false;
  renderApp();
};
(window as unknown as Record<string, unknown>).openShortcuts = () => {
  shortcutsModalOpen = true;
  renderApp();
};
(window as unknown as Record<string, unknown>).closeShortcuts = () => {
  shortcutsModalOpen = false;
  renderApp();
};
(window as unknown as Record<string, unknown>).exportInvestigation = () => {
  const exportPayload = {
    format: 'elixirscope-investigation-bundle-v2',
    timestamp: new Date().toISOString(),
    focus: appState,
    activeEvent: getActiveEvent(),
    findings: findingsList,
    milestones: comparisonMilestones
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `elixirscope-investigation-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupKeyboard();
  renderApp();
});
