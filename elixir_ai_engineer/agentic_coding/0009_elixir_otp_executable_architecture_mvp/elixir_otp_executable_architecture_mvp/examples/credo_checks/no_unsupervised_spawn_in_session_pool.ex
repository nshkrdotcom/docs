defmodule Credo.Check.ArchEx.NoUnsupervisedSpawnInSessionPool do
  use Credo.Check,
    category: :warning,
    base_priority: :high,
    explanations: [check: "session_pool.checkout forbids unsupervised process spawn"]

  @forbidden_calls [:spawn, :spawn_link]

  def run(source_file, params) do
    issue_meta = IssueMeta.for(source_file, params)

    Credo.Code.prewalk(source_file, &traverse(&1, &2, issue_meta))
  end

  defp traverse({call, meta, _args} = ast, issues, issue_meta) when call in @forbidden_calls do
    issue = format_issue(
      issue_meta,
      message: "Use a declared Supervisor/DynamicSupervisor instead of #{call}/...",
      line_no: meta[:line]
    )

    {ast, [issue | issues]}
  end

  defp traverse(ast, issues, _issue_meta), do: {ast, issues}
end
