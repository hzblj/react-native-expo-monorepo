package com.jan.kotlin.secure.core

interface SecureCoreInterface {
    fun getStorageKey(): String
    fun getEncryptionKey(): String
    fun getInstallationId(): String
}
