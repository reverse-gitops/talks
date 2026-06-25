# Audience questions (from last session)

Questions raised during the previous session, names stripped. Some were already
covered last time / are addressed in the current deck; others are still open. We
won't get to all of them today.

- Why not just snapshot or back up etcd?
- Is status preserved?
- Did you consider reusing the SSA / field-owners pattern from the Kubernetes API?
- Isn't a YAML'd audit trail of user-deployed resources essentially their state plus history?
- Long git history can be problematic — how do you handle conflicts?
- What's the conflict-resolution strategy? Does this only work for known/integrated YAML types?
- Any plan for an API to view the Git changes through the Kubernetes API?
- If Git is unreachable, is the operation blocked, or does it just fail to push?
