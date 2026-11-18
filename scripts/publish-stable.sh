#!/usr/bin/env bash
# Called only after Quality passes for the tag. Never overwrite a public asset.
set -euo pipefail
cd -- "$(dirname -- "$0")/.."
tag=${GITHUB_REF_NAME:?missing tag}
repo=${GITHUB_REPOSITORY:?missing repository}
version=$(node scripts/release-version.cjs --stable-tag "$tag")
sha=$(git rev-parse HEAD)
assert_remote_tag() {
  local remote
  remote=$(gh api "repos/$repo/commits/$tag" --jq '.sha')
  if [[ "$remote" != "$sha" ]]; then echo "Tag no longer resolves to the tested commit $sha" >&2; return 1; fi
}
assert_remote_tag
files=(yourtube.user.js yourtube.meta.js)
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
verify_assets() {
  local dir file
  local -a patterns=()
  for file in "$@"; do patterns+=(--pattern "$file"); done
  dir=$(mktemp -d "$scratch/read.XXXXXX")
  gh release download "$tag" --repo "$repo" --dir "$dir" "${patterns[@]}"
  for file in "$@"; do
    if ! cmp -s "$file" "$dir/$file"; then echo "Release asset missing or different: $file" >&2; return 1; fi
  done
}
# A permission/network error must not be interpreted as a missing release.
state=$(gh api --paginate "repos/$repo/releases?per_page=100" --jq '.[] | [.tag_name, .draft, .prerelease] | @tsv' |
  awk -F '\t' -v t="$tag" '$1 == t {print $2 ":" $3}')
case "$state" in
  false:false)
    verify_assets "${files[@]}"
    echo "Already published; both assets are byte-identical. No change."
    exit 0 ;;
  '')
    gh release create "$tag" --repo "$repo" --verify-tag --draft --title "YourTube $version" --generate-notes ;;
  true:false) echo "Resuming the existing stable draft." ;;
  *) echo "Refusing to repurpose an existing prerelease or ambiguous release: $tag" >&2; exit 1 ;;
esac
# A failed upload/comparison leaves a draft, never a half-populated update channel.
present=$(gh release view "$tag" --repo "$repo" --json assets --jq '.assets[].name')
missing=()
for file in "${files[@]}"; do
  if grep -Fxq -- "$file" <<<"$present"; then
    verify_assets "$file"    # Never clobber a differing file, even in a draft.
  else
    missing+=("$file")
  fi
done
if (( ${#missing[@]} )); then gh release upload "$tag" --repo "$repo" "${missing[@]}"; fi
verify_assets "${files[@]}"
assert_remote_tag
gh release edit "$tag" --repo "$repo" --draft=false
verify_assets "${files[@]}"
sha256sum "${files[@]}"
