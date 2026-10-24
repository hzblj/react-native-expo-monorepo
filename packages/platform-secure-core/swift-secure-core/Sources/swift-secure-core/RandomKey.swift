//
//  RandomKey.swift
//  swift-secure-core
//
//  Created by Jan Blazej on 06.07.2025.
//

import Foundation
import Security

/// Generates the key material the two MMKV keys are made of.
///
/// 24 random bytes encode to exactly 32 base64 characters — MMKV's maximum key length under AES-256,
/// with no padding to strip. The URL-safe alphabet matters because the same generator also produces
/// the MMKV instance id, and that id becomes a file name.
enum RandomKey {
    private static let byteCount = 24

    static func make() throws -> String {
        var bytes = [UInt8](repeating: 0, count: byteCount)
        let status = SecRandomCopyBytes(kSecRandomDefault, byteCount, &bytes)

        guard status == errSecSuccess else {
            throw SecureCoreError.randomGenerationFailed(status)
        }

        return Data(bytes).base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
    }
}
