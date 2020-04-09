workflow "Test" {
  on = "push"
  resolves = ["Run test"]
}

action "Run test" {
  uses = "denolib/deno-action@0.20.0"
  args = "run route_parser_test.ts"
}
