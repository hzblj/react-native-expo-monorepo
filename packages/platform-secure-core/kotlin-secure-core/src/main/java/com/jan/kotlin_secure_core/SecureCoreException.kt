package com.jan.kotlin.secure.core

/**
 * Thrown rather than falling back to some other key: a wrong key opens an empty MMKV instance
 * instead of the real one, so carrying on silently would be indistinguishable from data loss.
 */
class SecureCoreException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
