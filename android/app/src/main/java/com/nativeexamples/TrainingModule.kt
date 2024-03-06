package com.nativeexamples

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.text.SimpleDateFormat
import java.util.Date

class TrainingModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = javaClass.simpleName

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDate(format: String): String {
        val formatter =  SimpleDateFormat(format)
        val date = Date()
        return formatter.format(date)
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun getDateAsync(format: String, callback: Callback) {
        val formatter =  SimpleDateFormat(format)
        val date = Date()
        val result = formatter.format(date)
        callback.invoke(result)
    }

}