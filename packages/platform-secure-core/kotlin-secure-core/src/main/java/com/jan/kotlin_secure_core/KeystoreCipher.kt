package com.jan.kotlin.secure.core

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.io.IOException
import java.security.GeneralSecurityException
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * AES-256-GCM under a master key that is generated inside the Android Keystore and cannot be
 * extracted from it — hardware-backed on every device with a TEE.
 *
 * The Keystore insists on choosing the IV for GCM, so it is prefixed to the ciphertext instead of
 * being stored beside it.
 */
internal class KeystoreCipher(private val alias: String) {
    fun encrypt(value: String): ByteArray = translatingFailures {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, masterKey())

        cipher.iv + cipher.doFinal(value.toByteArray(Charsets.UTF_8))
    }

    fun decrypt(payload: ByteArray): String {
        if (payload.size <= IV_SIZE) {
            throw SecureCoreException("A stored key is ${payload.size} bytes — too short to hold a $IV_SIZE-byte IV.")
        }

        return translatingFailures {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, masterKey(), GCMParameterSpec(TAG_SIZE_BITS, payload, 0, IV_SIZE))

            String(cipher.doFinal(payload, IV_SIZE, payload.size - IV_SIZE), Charsets.UTF_8)
        }
    }

    private fun masterKey(): SecretKey = storedMasterKey() ?: generateMasterKey()

    private fun storedMasterKey(): SecretKey? {
        val keyStore = KeyStore.getInstance(PROVIDER).apply { load(null) }

        return (keyStore.getEntry(alias, null) as? KeyStore.SecretKeyEntry)?.secretKey
    }

    private fun generateMasterKey(): SecretKey {
        val specification = KeyGenParameterSpec
            .Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(KEY_SIZE_BITS)
            .build()

        return KeyGenerator
            .getInstance(KeyProperties.KEY_ALGORITHM_AES, PROVIDER)
            .apply { init(specification) }
            .generateKey()
    }

    /** The Keystore reports everything as a checked JCA failure; the caller only cares that it failed. */
    private inline fun <T> translatingFailures(block: () -> T): T =
        try {
            block()
        } catch (error: GeneralSecurityException) {
            throw SecureCoreException("The Android Keystore could not process a stored key.", error)
        } catch (error: IOException) {
            throw SecureCoreException("The Android Keystore could not be opened.", error)
        }

    private companion object {
        const val PROVIDER = "AndroidKeyStore"
        const val TRANSFORMATION = "AES/GCM/NoPadding"
        const val IV_SIZE = 12
        const val TAG_SIZE_BITS = 128
        const val KEY_SIZE_BITS = 256
    }
}
