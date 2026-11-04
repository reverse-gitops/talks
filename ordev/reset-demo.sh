#!/usr/bin/env bash
# Clears what an audience left behind in the voter demo, so the next talk starts empty.
# Shows what it would do; only --apply deletes. Run it after a talk, never during one.
#
#   ordev/reset-demo.sh mission2                     dry run
#   ordev/reset-demo.sh mission2 --apply             delete
#   ordev/reset-demo.sh ordev-1-stamp --apply --rounds   also put the question rounds back as in Git
#
# For each named Room: its Seats (a SeatingPlan has the same name as its Room) and its Participants.
# Always: every QuizSubmission, because a ballot is not tied to a Room (see demo-questions.yaml).
# Rooms, SeatingPlans, CoffeeConfigs, Databases and CommitRequests stay.
#
# Seats are in Git, and the sink commits their removal; the script stops if a Seat is not in Git yet.
# Participants and QuizSubmissions are NOT in Git, so --apply first saves them to BACKUP_ROOT.
# That backup holds attendee names: think before pushing it to a public repo.
set -euo pipefail

NS=voter
CONTEXT=k8s-koudijs-dev-oidc
TRAIL="$(cd "$(dirname "$0")/../external/k8s-trail" && pwd)"
BACKUP_ROOT="${BACKUP_ROOT:-$(cd "$(dirname "$0")/../settings-that-break" && pwd)/reset-backups}"

SEATS=seats.examples.configbutler.ai
PARTICIPANTS=participants.room-pass.koudijs.dev
SUBMISSIONS=quizsubmissions.examples.configbutler.ai
SESSIONS=quizsessions.examples.configbutler.ai
ROOMS=rooms.room-pass.koudijs.dev

apply=false rounds=false rooms=()
for arg in "$@"; do
  case "$arg" in
    --apply) apply=true ;;
    --rounds) rounds=true ;;
    -*) echo "unknown option: $arg" >&2; exit 2 ;;
    *) rooms+=("$arg") ;;
  esac
done
[ "${#rooms[@]}" -gt 0 ] || { sed -n 2,7p "$0" >&2; exit 2; }

current="$(kubectl config current-context)"
[ "$current" = "$CONTEXT" ] || { echo "wrong cluster: on '$current', expected '$CONTEXT'" >&2; exit 1; }
for room in "${rooms[@]}"; do
  kubectl -n "$NS" get "$ROOMS" "$room" -o name >/dev/null
done

seats_json="$(kubectl -n "$NS" get "$SEATS" -o json)"
participants_json="$(kubectl -n "$NS" get "$PARTICIPANTS" -o json)"
seats_of() { jq -r --arg v "$1" '.items[] | select(.spec.seatingPlanRef.name == $v) | .metadata.name' <<<"$seats_json"; }
participants_of() { jq -r --arg v "$1" '.items[] | select(.spec.roomRef.name == $v) | .metadata.name' <<<"$participants_json"; }
count() { grep -c . || true; }

# Seats only leave this script's hands once GitHub has them.
git -C "$TRAIL" fetch --quiet origin main
in_git="$(git -C "$TRAIL" grep -hE '^  name: ' FETCH_HEAD -- 'seats/row-*.yaml' | awk '{print $2}' | sort -u)"
missing=""
for room in "${rooms[@]}"; do
  missing+="$(seats_of "$room" | sort -u | comm -23 - <(printf '%s\n' "$in_git"))"$'\n'
done
missing="$(grep . <<<"$missing" || true)"

echo "cluster $current, namespace $NS"
for room in "${rooms[@]}"; do
  echo "$room: $(seats_of "$room" | count) Seats, $(participants_of "$room" | count) Participants (not in Git)"
done
echo "all rooms: $(jq '.items | length' < <(kubectl -n "$NS" get "$SUBMISSIONS" -o json)) QuizSubmissions (not in Git)"
if [ -n "$missing" ]; then
  echo "NOT in Git yet, so nothing can be deleted:"; sed 's/^/  /' <<<"$missing"
else
  echo "every Seat listed above is in Git"
fi
$rounds && echo "rounds: delete round-1 and round-2, Flux recreates them as in Git"

if ! $apply; then
  echo "dry run: nothing deleted. Add --apply to do this."
  exit 0
fi
[ -z "$missing" ] || { echo "stopped: wait a minute for the sink to commit, then run this again" >&2; exit 1; }

umask 077
backup="$BACKUP_ROOT/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup"
for kind in "$SEATS" "$PARTICIPANTS" "$SUBMISSIONS" "$SESSIONS"; do
  kubectl -n "$NS" get "$kind" -o json >"$backup/${kind%%.*}.json"
done
echo "backup: $backup"

for room in "${rooms[@]}"; do
  seats_of "$room" | xargs -r kubectl -n "$NS" delete "$SEATS"
  participants_of "$room" | xargs -r kubectl -n "$NS" delete "$PARTICIPANTS"
done
kubectl -n "$NS" delete "$SUBMISSIONS" --all

if $rounds; then
  kubectl -n "$NS" delete "$SESSIONS" round-1 round-2
  flux reconcile kustomization voter-demo --with-source
  kubectl -n "$NS" get "$SESSIONS"
fi

echo "left in $NS:"
kubectl -n "$NS" get "$SEATS" --no-headers 2>/dev/null | count | sed 's/$/ Seats/'
kubectl -n "$NS" get "$PARTICIPANTS" --no-headers 2>/dev/null | count | sed 's/$/ Participants/'
kubectl -n "$NS" get "$SUBMISSIONS" --no-headers 2>/dev/null | count | sed 's/$/ QuizSubmissions/'
echo "the sink commits the Seats' removal to k8s-trail within about a minute"
