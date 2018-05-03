/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable } from "rxjs/Observable";
import { IMockMediaKeys } from "../../compat";
import EncryptedMediaError from "../../errors/EncryptedMediaError";
import castToObservable from "../../utils/castToObservable";
import { ErrorStream } from "./session";

/**
 * Call the setServerCertificate API with the given certificate.
 * Complete when worked, throw when failed.
 *
 * TODO Manage success?
 * From the spec:
 *   - setServerCertificate resolves with true if everything worked
 *   - it resolves with false if the CDM does not support server
 *     certificates.
 *
 * @param {MediaKeys} mediaKeys
 * @param {ArrayBuffer} serverCertificate
 * @returns {Observable}
 */
function setServerCertificate(
  mediaKeys : IMockMediaKeys|MediaKeys,
  serverCertificate : ArrayBuffer|TypedArray
) : Observable<never> {
  return Observable.defer(() => {
    return castToObservable(
      mediaKeys.setServerCertificate(serverCertificate)
    )
      .ignoreElements()
      .catch((error) => {
        throw new
          EncryptedMediaError("LICENSE_SERVER_CERTIFICATE_ERROR", error, true);
      });
  }) as Observable<never>;
}

/**
 * Call the setCertificate API. If it fails just emit the error through the
 * errorStream and complete.
 * @param {MediaKeys} mediaKeys
 * @param {ArrayBuffer} serverCertificate
 * @returns {Observable}
 */
function trySettingServerCertificate(
  mediaKeys : IMockMediaKeys|MediaKeys,
  serverCertificate : ArrayBuffer|TypedArray,
  errorStream: ErrorStream
) : Observable<never> {
  return setServerCertificate(mediaKeys, serverCertificate)
    .catch(error => {
      error.fatal = false;
      errorStream.next(error);
      return Observable.empty<never>();
    });
}

export {
  trySettingServerCertificate,
  setServerCertificate,
};

export default setServerCertificate;
