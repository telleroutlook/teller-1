export default defineNuxtPlugin(() => {
  if (process.dev || import.meta.dev) {
    // Store original console methods
    const originalWarn = console.warn
    const originalError = console.error

    // Filter out specific Vue warnings that we know about and have addressed
    console.warn = function (...args: any[]) {
      const message = args.join(' ')
      
      // Skip specific warnings we know about
      if (
        message.includes('Suspense is an experimental feature') ||
        message.includes('its API will likely change') ||
        message.includes('Hydration style mismatch') ||
        message.includes('Hydration node mismatch') ||
        message.includes('Hydration completed but contains mismatches') ||
        message.includes('Unhandled error during execution of native event handler')
      ) {
        return
      }
      
      // Pass through other warnings
      originalWarn.apply(console, args)
    }

    console.error = function (...args: any[]) {
      const message = args.join(' ')
      
      // Skip source map errors that are common in development
      if (
        message.includes('source-map-loader') ||
        message.includes('installHook.js.map')
      ) {
        return
      }
      
      // Pass through other errors
      originalError.apply(console, args)
    }
  }
}) 