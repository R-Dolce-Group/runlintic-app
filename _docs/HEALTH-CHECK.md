# Health Check

The health check is a script that runs a series of commands to ensure that the project is in a healthy state. It runs the following commands:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run maintenance`

To run the health check, run the following command:

```bash
pnpm run health-check
```

In the event there is an error or issue with the health check, it will be reported and the script will exit with a non-zero exit code. 

Additionally, there are several Debugging Scripts Available to help you debug issues with the health check. These are:

- `pnpm run lint:fix`
- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run maintenance`


## Granular Debugging

If you want to run the health check granularly, you can run the following commands:

```bash
# Break down the maintenance step:
pnpm run knip          # Just knip analysis
pnpm run depcheck      # Just dependency checking
pnpm run manypkg:fix   # Just package.json sorting
```      

## Lint-Specific Debugging

If you want to run the lint step granularly, you can run the following commands:

```bash
pnpm run lint
pnpm run lint:fix
```

## Dependency Management

Dependency Management is a series of commands that are run to ensure that the project's dependencies are in a healthy state. It runs the following commands:

```bash
pnpm run deps:check
pnpm run deps:audit
pnpm run deps:dedupe
pnpm run deps:outdated
pnpm run deps:update
pnpm run deps:update-latest
pnpm run deps:validate
```
## Recommended Debugging Approaches

If health-check fails, run this sequence:

```bash
# Core debugging sequence:
pnpm run lint          # Check for linting issues first
pnpm run knip          # Identify unused dependencies/exports
pnpm run depcheck      # Find missing/unused dependencies
pnpm run typecheck     # Verify TypeScript issues

# Additional dependency management:
pnpm run deps:audit    # Check for dependency vulnerabilities
pnpm run deps:dedupe   # Remove duplicate dependencies
pnpm run deps:outdated # Check for outdated dependencies
pnpm run deps:update   # Update dependencies
pnpm run deps:validate # Validate dependencies

# Final steps:
pnpm run manypkg:fix   # Fix package.json sorting
pnpm run build         # Build the project
pnpm run maintenance   # Run all maintenance tasks
```





