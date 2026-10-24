//
//  SecureCoreError.swift
//  swift-secure-core
//
//  Created by Jan Blazej on 06.07.2025.
//

import Foundation

/// Every way key material can fail to be produced or recovered.
///
/// There is deliberately no fallback value: a wrong key opens an empty MMKV instance rather than the
/// real one, so silently carrying on would look like data loss. Throwing surfaces the `OSStatus`
/// instead, which is the only thing that makes a Keychain failure diagnosable.
public enum SecureCoreError: Error {
    /// The CSPRNG refused. Effectively impossible outside a device in a very bad state.
    case randomGenerationFailed(OSStatus)
    /// The Keychain item exists but could not be read — most often the device is still locked.
    case keychainReadFailed(account: String, status: OSStatus)
    /// The Keychain refused to store a freshly generated key.
    case keychainWriteFailed(account: String, status: OSStatus)
    /// The item came back as something other than the UTF-8 string that was written.
    case keychainItemCorrupted(account: String)
}

extension SecureCoreError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case let .randomGenerationFailed(status):
            "SecureCore could not generate a random key (OSStatus \(status))."
        case let .keychainReadFailed(account, status):
            "SecureCore could not read '\(account)' from the Keychain (OSStatus \(status))."
        case let .keychainWriteFailed(account, status):
            "SecureCore could not write '\(account)' to the Keychain (OSStatus \(status))."
        case let .keychainItemCorrupted(account):
            "SecureCore found '\(account)' in the Keychain, but it is not a UTF-8 string."
        }
    }
}
