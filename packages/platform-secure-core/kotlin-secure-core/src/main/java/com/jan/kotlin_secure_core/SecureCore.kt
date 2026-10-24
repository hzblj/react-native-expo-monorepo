package com.jan.kotlin.secure.core

import android.content.Context
import java.util.UUID

/**
 * The three values the JS side asks for, none of which is a literal anywhere.
 *
 * Each is generated from `SecureRandom` the first time it is asked for and kept encrypted under an
 * Android Keystore master key, so it is stable across launches and app updates while never
 * appearing in the binary or the JS bundle.
 *
 * All three live in the app's own data directory, exactly like the MMKV files they protect — an
 * uninstall takes the keys and the store together, so the two can never drift apart. `installationId`
 * therefore counts installs here, while its iOS namesake outlives one; neither platform can promise
 * the other's behaviour, and the store treats it as an install id rather than a device id for that
 * reason.
 */
class SecureCore(context: Context) : SecureCoreInterface {
    private val storage = EncryptedKeyStorage(context)
    private val cache = mutableMapOf<Account, String>()

    override fun getStorageKey(): String = key(Account.STORAGE_KEY)

    override fun getEncryptionKey(): String = key(Account.ENCRYPTION_KEY)

    override fun getInstallationId(): String = key(Account.INSTALLATION_ID)

    /** Preference entry per key. Renaming one strands whatever is stored under the old name. */
    private enum class Account(val entry: String) {
        ENCRYPTION_KEY("storage-encryption-key"),
        INSTALLATION_ID("installation-id"),
        STORAGE_KEY("storage-id"),
        ;

        /**
         * The install id is a UUID because it leaves the device in analytics payloads and is read by
         * people; the two MMKV keys are raw entropy sized to what MMKV accepts.
         */
        fun makeValue(): String =
            when (this) {
                INSTALLATION_ID -> UUID.randomUUID().toString()
                ENCRYPTION_KEY, STORAGE_KEY -> RandomKey.make()
            }
    }

    /** Serialised so two callers racing on a cold cache cannot each generate and store a key. */
    @Synchronized
    private fun key(account: Account): String =
        cache.getOrPut(account) { storage.read(account.entry) ?: generate(account) }

    private fun generate(account: Account): String = account.makeValue().also { storage.write(account.entry, it) }
}
