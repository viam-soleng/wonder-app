VERSION := $(shell git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")

module: dist/index.html
	tar czf module.tar.gz meta.json dist

dist/index.html: *.json index.html src/*.css src/*.ts src/*.svelte src/lib/* node_modules
	pnpm run build

node_modules: package.json
	pnpm install

upload: module
	viam module upload --upload module.tar.gz --platform any --version $(VERSION)

show-version:
	@echo "Current version: $(VERSION)"

bump-patch:
	@NEXT=$$(echo $(VERSION) | awk -F. '{$$NF = $$NF + 1;} 1' | sed 's/ /./g') && \
	echo "Bumping version: $(VERSION) -> $$NEXT" && \
	git tag $$NEXT && \
	echo "Created tag $$NEXT (not pushed yet)" && \
	echo "Run 'make deploy' to push"

deploy:
	@LATEST=$$(git describe --tags --abbrev=0 2>/dev/null) && \
	echo "Deploying version $$LATEST..." && \
	git push origin main $$LATEST && \
	echo "Deployed version $$LATEST"

clean:
	rm -rf dist module.tar.gz
