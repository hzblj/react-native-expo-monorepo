package com.jan.kotlin.secure.core

import android.util.Base64
import java.security.SecureRandom

/**
 * Generates the key material the two MMKV keys are made of.
 *
 * 24 random bytes encode to exactly 32 base64 characters — MMKV's maximum key length under AES-256,
 * with no padding to strip. The URL-safe alphabet matters because the same generator also produces
 * the MMKV instance id, and that id becomes a file name.
 */
internal object RandomKey {
    private const val BYTE_COUNT = 24
    private val FLAGS = Base64.NO_WRAP or Base64.NO_PADDING or Base64.URL_SAFE

    private val random = SecureRandom()

    fun make(): String = Base64.encodeToString(ByteArray(BYTE_COUNT).also(random::nextBytes), FLAGS)
}
