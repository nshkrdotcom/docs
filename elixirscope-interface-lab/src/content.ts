/* The source-code excerpts and repository/change names below are ILLUSTRATIVE UI CONTENT.
   The trace events in fixtures.ts are extracted verbatim from the supplied synthetic fixtures. */
const symbols: SymbolItem[] = [
  {
    id:'handle_info', name:'handle_info/2', module:'CommandWorker', file:'lib/otp_recovery/command_worker.ex',
    kind:'callback', change:'Modified', badge:'M', group:'changed',range:'L40–66',impact:'2 effects',
    summary:'Entry point for the command execution path. Recovery can revisit a command after a worker restart.',
    lines:[
      {old:40,next:40,text:'@impl true',kind:'context'},
      {old:41,next:41,text:'def handle_info({:execute, command}, state) do',kind:'context'},
      {old:42,next:42,text:'  case Journal.status(command.id) do',kind:'context'},
      {old:43,next:43,text:'    :committed ->',kind:'context'},
      {old:44,next:44,text:'      {:noreply, state}',kind:'context'},
      {old:45,text:'    :pending -> dispatch(command, state)',kind:'remove'},
      {next:45,text:'    :pending ->',kind:'add'},
      {next:46,text:'      recover(command, state)',kind:'add',note:'path'},
      {old:46,next:47,text:'    :missing ->',kind:'context'},
      {old:47,next:48,text:'      {:noreply, state}',kind:'context'},
      {old:48,next:49,text:'  end',kind:'context'},
      {old:49,next:50,text:'end',kind:'context'},
      {old:50,next:51,text:'',kind:'context'},
      {old:51,next:52,text:'defp dispatch(command, state) do',kind:'context'},
      {old:52,next:53,text:'  with {:ok, result} <- Gateway.dispatch(command),',kind:'focus',note:'effect'},
      {old:53,next:54,text:'       :ok <- Journal.commit(command.id, result) do',kind:'context'},
      {old:54,next:55,text:'    {:noreply, track_completion(state, command.id)}',kind:'context'},
      {old:55,next:56,text:'  else',kind:'context'},
      {old:56,next:57,text:'    {:error, reason} -> {:stop, reason, state}',kind:'context'},
      {old:57,next:58,text:'  end',kind:'context'},
      {old:58,next:59,text:'end',kind:'context'}
    ]
  },
  {
    id:'recover',name:'recover/2',module:'CommandWorker',file:'lib/otp_recovery/command_worker.ex',
    kind:'recovery',change:'Modified',badge:'M',group:'changed',range:'L71–99',impact:'1 effect',
    summary:'The recovery branch resubmits pending commands. Its relationship to prior external completion remains unverified.',
    lines:[
      {old:71,next:71,text:'defp recover(command, state) do',kind:'context'},
      {old:72,next:72,text:'  case Journal.status(command.id) do',kind:'context'},
      {old:73,next:73,text:'    :committed ->',kind:'context'},
      {old:74,next:74,text:'      {:noreply, state}',kind:'context'},
      {old:75,text:'    :pending -> {:noreply, state}',kind:'remove'},
      {next:75,text:'    :pending ->',kind:'add'},
      {next:76,text:'      # Prior external outcome may be unknown',kind:'add'},
      {next:77,text:'      Gateway.dispatch(command)',kind:'add',note:'effect'},
      {next:78,text:'      {:noreply, state}',kind:'add'},
      {old:76,next:79,text:'    :missing ->',kind:'context'},
      {old:77,next:80,text:'      {:noreply, state}',kind:'context'},
      {old:78,next:81,text:'  end',kind:'context'},
      {old:79,next:82,text:'end',kind:'context'},
      {old:80,next:83,text:'',kind:'context'},
      {old:81,next:84,text:'defp track_completion(state, id) do',kind:'context'},
      {old:82,next:85,text:'  update_in(state.completed, &MapSet.put(&1, id))',kind:'context'},
      {old:83,next:86,text:'end',kind:'context'}
    ]
  },
  {
    id:'journal',name:'status/1',module:'Journal',file:'lib/otp_recovery/journal.ex',
    kind:'storage',change:'Modified',badge:'M',group:'changed',range:'L24–43',impact:'1 caller',
    summary:'Journal tracks local pending/committed states, but a pending record does not reveal the gateway’s external outcome.',
    lines:[
      {old:24,next:24,text:'def status(command_id) do',kind:'context'},
      {old:25,next:25,text:'  case Repo.get(CommandEntry, command_id) do',kind:'context'},
      {old:26,next:26,text:'    nil -> :missing',kind:'context'},
      {old:27,next:27,text:'    %{status: :committed} -> :committed',kind:'context'},
      {old:28,text:'    _ -> :pending',kind:'remove'},
      {next:28,text:'    %{status: :pending} -> :pending',kind:'add'},
      {next:29,text:'    %{status: :retrying} -> :pending',kind:'add'},
      {old:29,next:30,text:'  end',kind:'context'},
      {old:30,next:31,text:'end',kind:'context'},
      {old:31,next:32,text:'',kind:'context'},
      {old:32,next:33,text:'def commit(command_id, response) do',kind:'context'},
      {old:33,next:34,text:'  Repo.update_all(',kind:'context'},
      {old:34,next:35,text:'    where(CommandEntry, id: ^command_id),',kind:'context'},
      {old:35,next:36,text:'    set: [status: :committed, result: response]',kind:'context'},
      {old:36,next:37,text:'  )',kind:'context'},
      {old:37,next:38,text:'end',kind:'context'}
    ]
  },
  {
    id:'supervisor',name:'init/1',module:'CommandSupervisor',file:'lib/otp_recovery/command_supervisor.ex',
    kind:'supervision',change:'Modified',badge:'M',group:'changed',range:'L12–31',impact:'2 actors',
    summary:'The supervision tree governs process replacement. A restarted worker has a new process incarnation.',
    lines:[
      {old:12,next:12,text:'@impl true',kind:'context'},
      {old:13,next:13,text:'def init(_args) do',kind:'context'},
      {old:14,next:14,text:'  children = [',kind:'context'},
      {old:15,next:15,text:'    {CommandWorker, name: CommandWorker}',kind:'context'},
      {old:16,next:16,text:'  ]',kind:'context'},
      {old:17,text:'  Supervisor.init(children, strategy: :one_for_one)',kind:'remove'},
      {next:17,text:'  Supervisor.init(children,',kind:'add'},
      {next:18,text:'    strategy: :one_for_one,',kind:'add'},
      {next:19,text:'    max_restarts: 5,',kind:'add'},
      {next:20,text:'    max_seconds: 10',kind:'add'},
      {next:21,text:'  )',kind:'add'},
      {old:18,next:22,text:'end',kind:'context'}
    ]
  },
  {
    id:'gateway',name:'dispatch/1',module:'Gateway',file:'lib/otp_recovery/gateway.ex',
    kind:'effect',change:'Impacted',badge:'↗',group:'related',range:'L22–48',impact:'external I/O',
    summary:'Possible external write boundary. The fixture observes attempts but not external durable completion.',
    lines:[
      {old:22,next:22,text:'def dispatch(command) do',kind:'context'},
      {old:23,next:23,text:'  request = encode(command)',kind:'context'},
      {old:24,next:24,text:'  Telemetry.span([:gateway, :dispatch],',kind:'context'},
      {old:25,next:25,text:'    %{command_id: command.id}, fn ->',kind:'context'},
      {old:26,next:26,text:'    Client.post("/operations", request)',kind:'focus',note:'effect'},
      {old:27,next:27,text:'  end)',kind:'context'},
      {old:28,next:28,text:'end',kind:'context'},
      {old:29,next:29,text:'',kind:'context'},
      {old:30,next:30,text:'defp encode(command) do',kind:'context'},
      {old:31,next:31,text:'  %{id: command.id, payload: command.payload}',kind:'context'},
      {old:32,next:32,text:'end',kind:'context'}
    ]
  },
  {
    id:'test',name:'crash_recovery/1',module:'OtpRecoveryTest',file:'test/otp_recovery_test.exs',
    kind:'test lead',change:'Candidate',badge:'T',group:'related',range:'L60–92',impact:'1 lead',
    summary:'Illustrative test source. The fixture lists a crash recovery test lead as a candidate, not confirmed test coverage.',
    lines:[
      {old:60,next:60,text:'test "recovers command after worker exit" do',kind:'context'},
      {old:61,next:61,text:'  command = command_fixture("cmd-42")',kind:'context'},
      {old:62,next:62,text:'  :ok = Runner.submit(command)',kind:'context'},
      {old:63,next:63,text:'  Process.exit(worker_pid(), :kill)',kind:'focus'},
      {old:64,next:64,text:'  assert eventually(fn -> Worker.alive?() end)',kind:'context'},
      {old:65,next:65,text:'  assert Journal.status(command.id) == :pending',kind:'context'},
      {old:66,next:66,text:'end',kind:'context'}
    ]
  }
];
const nodeGraph:GraphNode[]=[
 {id:'ingress',label:'Ingress',subtitle:'command intake',type:'process',x:135,y:178,status:'observed',detail:'Accepts cmd-42 and emits a correlated message (msg-42) to the worker.'},
 {id:'worker',label:'CommandWorker',subtitle:'handle_info/2 · recovery',type:'process',x:396,y:178,status:'observed',detail:'The original worker observed an external attempt, then exited. A replacement worker made another attempt.'},
 {id:'gateway',label:'Gateway',subtitle:'external write boundary',type:'effect',x:675,y:102,status:'candidate',detail:'Static possible effect path; two attempts observed, their external completion not captured.'},
 {id:'journal',label:'Journal',subtitle:'persistence · node C',type:'storage',x:675,y:314,status:'partial',detail:'An observed journal record remains pending. No causal link to the gateway outcome was captured.'},
 {id:'supervisor',label:'Supervisor',subtitle:'one_for_one · node B',type:'supervisor',x:394,y:364,status:'observed',detail:'A supported supervisor-reaction edge connects the abnormal exit to the replacement worker spawn.'},
 {id:'client',label:'External service',subtitle:'outcome unavailable',type:'boundary',x:914,y:102,status:'unknown',detail:'Outside observed coverage. An attempted external effect is not proof of a completed operation.'}
];
const initialFindings:Finding[]=[
 {id:'F-001',title:'Recovery may repeat an external write',severity:'high',status:'In review',claim:'The failing fixture records two external write attempts for cmd-42 separated by a worker crash and restart. The first attempt’s external outcome is unknown.',anchor:'CommandWorker.recover/2',tags:['Observed attempts','Unresolved outcome'],evidence:4,gaps:1,created:'This investigation'},
 {id:'F-002',title:'Pending journal record outlives worker incarnation',severity:'medium',status:'Needs evidence',claim:'A pending journal record was observed. No recorded causal relation proves whether the external operation completed before the crash.',anchor:'Journal.status/1',tags:['Partial capture','State ownership'],evidence:2,gaps:2,created:'This investigation'},
 {id:'F-003',title:'Dynamic dispatch limits source-path completeness',severity:'low',status:'Open',claim:'The static effect path is a fixture-derived possible relationship. A source-edge cannot establish execution by itself.',anchor:'Gateway.dispatch/1',tags:['Static only','Analysis limit'],evidence:1,gaps:1,created:'This investigation'}
];
const viewLabels:Record<View,string>={review:'Semantic review',cinema:'Execution cinema',compare:'Run comparison',topology:'System topology',findings:'Findings ledger'};
const eventTitles:Record<string,string>={
 command_accepted:'Command accepted',message_sent:'Message dispatched',process_spawned:'Process spawned',
 message_received:'Message received',callback_enter:'Callback entered',callback_exit:'Callback completed',
 effect_attempted:'External write attempted',effect_result_observed:'Gateway result observed',
 state_observed:'Process state observed',process_exit:'Worker process exited',journal_write_observed:'Journal write observed'
};
const eventDescriptions:Record<string,string>={
 command_accepted:'Ingress accepted command cmd-42 within this capture scope.',
 message_sent:'A message send was observed and linked to its receive by a fixture message ID.',
 process_spawned:'A new process incarnation was observed under the command supervisor.',
 message_received:'A correlated receive was observed in the worker process.',
 callback_enter:'An instrumented callback-entry event was recorded. The call duration is not known.',
 callback_exit:'A callback exited in the passing recording.',
 effect_attempted:'The external write was attempted. Its durable external outcome was not captured.',
 effect_result_observed:'A test gateway acknowledgement was captured; this is not a production durable-commit proof.',
 state_observed:'Only a partial state snapshot was observed at this point. The intervening state is unknown.',
 process_exit:'A worker exit was recorded with injected_crash as the reason.',
 journal_write_observed:'A journal status was observed as pending, independent of the external outcome.'
};
const fixtureNodeLabel:Record<string,string>={
 'node-a-boot-1':'NODE A · ingress',
 'node-b-boot-1':'NODE B · workers',
 'node-c-boot-1':'NODE C · journal'
};
