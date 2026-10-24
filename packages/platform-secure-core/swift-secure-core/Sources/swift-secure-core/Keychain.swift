//
//  Keychain.swift
//  swift-secure-core
//
//  Created by Jan Blazej on 06.07.2025.
//

import Foundation
import Security

/// The thinnest possible typed wrapper over the `SecItem*` C API: read a string, write a string.
///
/// Items are generic passwords scoped to one service, protected with
/// `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` — readable in the background after the first
/// unlock following a reboot, never synced to iCloud, and never restored onto another device.
struct Keychain {
    let service: String

    func read(account: String) throws -> String? {
        var query = baseQuery(account: account)
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        if status == errSecItemNotFound {
            return nil
        }

        guard status == errSecSuccess else {
            throw SecureCoreError.keychainReadFailed(account: account, status: status)
        }

        guard let data = item as? Data, let value = String(data: data, encoding: .utf8) else {
            throw SecureCoreError.keychainItemCorrupted(account: account)
        }

        return value
    }

    func write(_ value: String, account: String) throws {
        var attributes = baseQuery(account: account)
        attributes[kSecValueData as String] = Data(value.utf8)
        attributes[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly

        let status = SecItemAdd(attributes as CFDictionary, nil)

        guard status == errSecSuccess else {
            throw SecureCoreError.keychainWriteFailed(account: account, status: status)
        }
    }

    private func baseQuery(account: String) -> [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
    }
}
