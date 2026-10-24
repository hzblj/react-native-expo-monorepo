//
//  SecureCore.swift
//  swift-secure-core
//
//  Created by Jan Blazej on 06.07.2025.
//

import Foundation

/// The three values that must outlive a launch without ever being a literal.
///
/// Each is generated from the CSPRNG the first time it is asked for and kept in the Keychain, so it
/// is stable across launches and app updates while never appearing in the binary or the JS bundle.
///
/// All three survive an uninstall, because iOS Keychain items do — the MMKV files do not, so a
/// reinstall starts an empty store under the old id. That is the harmless direction for the two
/// keys, and the point of `installationId`: the same install coming back is recognisable as such.
public final class SecureCore: @unchecked Sendable {
    public static let shared = SecureCore()

    /// AES-256 key for the MMKV instance — 32 characters, MMKV's maximum.
    public var encryptionKey: String {
        get throws { try key(for: .encryptionKey) }
    }

    /// The MMKV instance id, which MMKV also uses as the file name.
    public var storageKey: String {
        get throws { try key(for: .storageKey) }
    }

    /// Identifies this install, not this device — nothing here is a hardware identifier.
    public var installationId: String {
        get throws { try key(for: .installationId) }
    }

    /// Keychain account per value. Renaming a case strands whatever is stored under the old name.
    private enum Account: String {
        case encryptionKey = "storage-encryption-key"
        case installationId = "installation-id"
        case storageKey = "storage-id"

        /// The install id is a UUID because it leaves the device in analytics payloads and is read
        /// by people; the two MMKV keys are raw entropy sized to what MMKV accepts. Lowercased
        /// because `UUID.randomUUID()` is, and the two platforms have to be indistinguishable.
        func makeValue() throws -> String {
            switch self {
            case .installationId: UUID().uuidString.lowercased()
            case .encryptionKey, .storageKey: try RandomKey.make()
            }
        }
    }

    private let keychain: Keychain
    private let lock = NSLock()
    private var cache: [Account: String] = [:]

    private init() {
        let bundleIdentifier = Bundle.main.bundleIdentifier ?? "swift-secure-core"

        keychain = Keychain(service: "\(bundleIdentifier).secure-core")
    }

    /// Serialised so two callers racing on a cold cache cannot each generate and store a value.
    private func key(for account: Account) throws -> String {
        lock.lock()
        defer { lock.unlock() }

        if let cached = cache[account] {
            return cached
        }

        let key = try keychain.read(account: account.rawValue) ?? generate(for: account)
        cache[account] = key

        return key
    }

    private func generate(for account: Account) throws -> String {
        let key = try account.makeValue()
        try keychain.write(key, account: account.rawValue)

        return key
    }
}
