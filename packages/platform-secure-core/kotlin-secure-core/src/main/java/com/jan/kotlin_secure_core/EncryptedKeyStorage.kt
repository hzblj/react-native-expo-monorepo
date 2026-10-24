package com.jan.kotlin.secure.core

import android.content.Context
import android.util.Base64

/**
 * Keys at rest: only ciphertext reaches `SharedPreferences`, and what decrypts it never leaves the
 * Keystore. That is what `EncryptedSharedPreferences` does, minus the dependency — androidx's
 * version of it is deprecated.
 */
internal class EncryptedKeyStorage(
    context: Context,
    private val cipher: KeystoreCipher = KeystoreCipher(MASTER_KEY_ALIAS),
) {
    private val preferences = context.applicationContext.getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE)

    fun read(entry: String): String? {
        val stored = preferences.getString(entry, null) ?: return null

        return cipher.decrypt(Base64.decode(stored, FLAGS))
    }

    /**
     * `commit`, not `apply`: the caller encrypts a store with this key the moment it returns, so a
     * process death before an asynchronous write landed would strand unreadable files.
     */
    fun write(entry: String, key: String) {
        preferences
            .edit()
            .putString(entry, Base64.encodeToString(cipher.encrypt(key), FLAGS))
            .commit()
    }

    private companion object {
        const val FILE_NAME = "secure-core"
        const val MASTER_KEY_ALIAS = "secure-core-master-key"
        val FLAGS = Base64.NO_WRAP
    }
}
