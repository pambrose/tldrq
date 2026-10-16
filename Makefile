.PHONY: default help docs-serve docs-build docs-clean upgrade-site

# The docs site: uv project in website/, Zensical config and pages in website/tldrq.
WEBSITE_DIR := website
SITE_DIR := $(WEBSITE_DIR)/tldrq

default: help

help:  ## Show this help (list of targets)
	@awk 'BEGIN {FS = ":.*?## "; printf "Usage: make <target>\n\nTargets:\n"} \
		/^[a-zA-Z0-9_-]+:.*?## / {printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

docs-serve: docs-clean  ## Serve the docs site locally with Zensical (http://localhost:8000)
	cd $(SITE_DIR) && uv run zensical serve

# The same two commands .github/workflows/docs.yml runs.
docs-build: docs-clean  ## Check the nav and build the docs site into website/tldrq/site, as CI does
	cd $(SITE_DIR) && uv run --locked python ../check_nav.py
	cd $(SITE_DIR) && uv run --locked zensical build --clean --strict

docs-clean:  ## Remove the generated docs site and its cache
	rm -rf $(SITE_DIR)/site $(SITE_DIR)/.cache

upgrade-site:  ## Upgrade the docs-site dependencies
	cd $(WEBSITE_DIR) && env -u VIRTUAL_ENV uv lock --upgrade
