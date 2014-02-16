package com.jadoos.android;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.jadoos.JadoosAccount;
import com.jadoos.JdURN;
import com.jadoos.android.JadoosAndroidService;

/**
 * Provides access to the Jadoos Android SDK from Cordova/PhoneGap applications.
 * 
 * @author Lukas
 * 
 */
public class JadoosCordovaWrapper extends CordovaPlugin {

	private JadoosAndroidService service;

	public boolean execute(String action, JSONArray args,
			final CallbackContext callbackContext) throws JSONException {

		JSONObject response = new JSONObject();

		if (action.equals("initialize")) {
			// Initialize SDK
			try {
				service = new JadoosAndroidService(cordova.getActivity());
				response.put("appUrn", service.getApplicationURN());

				response.put("hasAccount", service.hasAccount());
				if (service.hasAccount()) {
					JadoosAccount account = service.getAccount();
					response.put("aauid", account.getAAUID());
					response.put("accessToken", account.getAccessToken());
				}
				
				callbackContext.success(response);
			} catch (Exception e) {
				callbackContext.error(0);
			}
			return true;
		}
		if (action.equals("silentRegister")) {
			// Register silently
			if (service!=null) {
				try {
					service.silentRegister();
					response.put("appUrn", service.getApplicationURN());
					response.put("hasAccount", service.hasAccount());
					if (service.hasAccount()) {
						JadoosAccount account = service.getAccount();
						response.put("aauid", account.getAAUID());
						response.put("accessToken", account.getAccessToken());
					}
					callbackContext.success(response);
				} catch (Exception e) {
					callbackContext.error(0);
				}
				return true;
			} else {
				callbackContext.error(0);
			}
			return true;
		}
			
		return false;
	}
}
