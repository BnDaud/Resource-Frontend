import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'

// The CMS is lazy-loaded, so the first render in a test file waits for its chunk to load.
configure({ asyncUtilTimeout: 5000 })
