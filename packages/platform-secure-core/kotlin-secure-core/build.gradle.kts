import org.jetbrains.kotlin.gradle.dsl.JvmTarget

/**
 * An Android library, not a plain JVM one: the keys are kept in the Android Keystore, and both that
 * and the `Context` needed to reach `SharedPreferences` are Android SDK, off the JVM classpath.
 */
plugins {
    id("com.android.library")
    kotlin("android")
}

group = "com.jan"
version = "1.0.0"

/** Published by `expo-root-project` in the generated app; the fallbacks are Expo SDK 57's. */
fun expoSdkVersion(name: String, fallback: Int): Int =
    (rootProject.extra.takeIf { it.has(name) }?.get(name) as? Int) ?: fallback

android {
    namespace = "com.jan.kotlin.secure.core"
    compileSdk = expoSdkVersion("compileSdkVersion", 36)

    defaultConfig {
        minSdk = expoSdkVersion("minSdkVersion", 24)
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(kotlin("stdlib"))
}
