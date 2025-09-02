# Health Check

The health check is a script that runs a series of commands to ensure that the project is in a healthy state. It runs the following commands:

- `npm run lint`
- `npm run typecheck`
- `npm run maintenance`

To run the health check, run the following command:

```bash
npm run health-check
```

In the event there is an error or issue with the health check, it will be reported and the script will exit with a non-zero exit code. 

Additionally, there are several Debugging Scripts Available to help you debug issues with the health check. These are:

- `npm run lint:fix`
- `npm run typecheck`
- `npm run format`
- `npm run maintenance`


## Granular Debugging

If you want to run the health check granularly, you can run the following commands:

```bash
# Break down the maintenance step:
npm run knip          # Just knip analysis
npm run depcheck      # Just dependency checking
npm run manypkg:fix   # Just package.json sorting
```      

## Lint-Specific Debugging

If you want to run the lint step granularly, you can run the following commands:

```bash
npm run lint
npm run lint:fix
```

## Dependency Management

Dependency Management is a series of commands that are run to ensure that the project's dependencies are in a healthy state. It runs the following commands:

```bash
npm run deps:check
npm run deps:audit
npm run deps:dedupe
npm run deps:outdated
npm run deps:update
npm run deps:update-latest
npm run deps:validate
```
## Recommended Debugging Approaches

If health-check fails, run this sequence:

```bash
# Core debugging sequence:
npm run lint          # Check for linting issues first
npm run knip          # Identify unused dependencies/exports
npm run depcheck      # Find missing/unused dependencies
npm run typecheck     # Verify TypeScript issues

# Additional dependency management:
npm run deps:audit    # Check for dependency vulnerabilities
npm run deps:dedupe   # Remove duplicate dependencies
npm run deps:outdated # Check for outdated dependencies
npm run deps:update   # Update dependencies
npm run deps:validate # Validate dependencies

# Final steps:
npm run manypkg:fix   # Fix package.json sorting
npm run format        # Format code with Prettier
npm run maintenance   # Run all maintenance tasks
```





