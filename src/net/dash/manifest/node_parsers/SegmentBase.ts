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

import objectAssign = require("object-assign");
import log from "../../../../utils/log";
import {
  parseBoolean,
  parseByteRange,
  parseDuration,
} from "../helpers";
import parseInitialization, {
  IParsedInitialization,
} from "./Initialization";

export interface ISegmentBaseAttributes {
  availabilityTimeComplete?: boolean;
  availabilityTimeOffset?: number;
  duration? : number;
  indexRange?: [number, number];
  indexRangeExact?: boolean;
  initialization?: IParsedInitialization;
  presentationTimeOffset?: number;
  startNumber? : number;
  timeShiftBufferDepth?: number;
  timescale?: number;
}

interface ISegmentBaseSegment {
  ts: number; // start timestamp
  d: number; // duration
  r: number; // repeat counter
  range?: [number, number];
}

export interface IParsedSegmentBase extends ISegmentBaseAttributes {
  availabilityTimeComplete : boolean;
  indexRangeExact : boolean;
  timeline : ISegmentBaseSegment[];
  timescale : number;
}

/**
 * TODO Only for SegmentBase not for other types
 * @param {Node} root
 * @returns {Object}
 */
export default function parseSegmentBase(root: Node) : IParsedSegmentBase {
  const attributes : ISegmentBaseAttributes = {};

  const segmentBaseChildren = root.childNodes;
  for (let i = 0; i < segmentBaseChildren.length; i++) {
    const currentNode = segmentBaseChildren[i];
    if (currentNode.nodeName === "Initialization") {
      attributes.initialization = parseInitialization(currentNode);
    }
  }

  for (let i = 0; i < root.attributes.length; i++) {
    const attribute = root.attributes[i];
    switch (attribute.name) {
      case "timescale": {
        const _timescale = parseInt(attribute.value, 10);
        if (isNaN(_timescale)) {
          log.warn(`DASH: invalid timescale ("${attribute.value}")`);
        } else {
          attributes.timescale = _timescale;
        }
      }
        break;
      case "timeShiftBufferDepth": {
        const timeShiftBufferDepth = parseDuration(attribute.value);
        if (isNaN(timeShiftBufferDepth)) {
          log.warn(`DASH: invalid timeShiftBufferDepth ("${attribute.value}")`);
        } else {
          attributes.timeShiftBufferDepth = timeShiftBufferDepth;
        }
      }
        break;
      case "presentationTimeOffset": {
        const _presentationTimeOffset = parseFloat(attribute.value);
        if (isNaN(_presentationTimeOffset)) {
          log.warn(`DASH: invalid presentationTimeOffset ("${attribute.value}")`);
        } else {
          attributes.presentationTimeOffset = _presentationTimeOffset;
        }
      }
        break;
      case "indexRange":
        attributes.indexRange = parseByteRange(attribute.value) || undefined;
        break;
      case "indexRangeExact":
        attributes.indexRangeExact = parseBoolean(attribute.value);
        break;
      case "availabilityTimeOffset": {
        const availabilityTimeOffset = parseFloat(attribute.value);
        if (isNaN(availabilityTimeOffset)) {
          log.warn(`DASH: invalid availabilityTimeOffset ("${attribute.value}")`);
        } else {
          attributes.availabilityTimeOffset = availabilityTimeOffset;
        }
      }
        break;
      case "availabilityTimeComplete":
        attributes.availabilityTimeComplete = parseBoolean(attribute.value);
        break;
      case "duration": {
        const duration = parseInt(attribute.value, 10);
        if (isNaN(duration)) {
          log.warn(`DASH: invalid duration ("${attribute.value}")`);
        } else {
          attributes.duration = duration;
        }
      }
        break;
      case "startNumber": {
        const startNumber = parseInt(attribute.value, 10);
        if (isNaN(startNumber)) {
          log.warn(`DASH: invalid startNumber ("${attribute.value}")`);
        } else {
          attributes.startNumber = startNumber;
        }
      }
        break;
    }
  }

  const timescale = attributes.timescale == null ? 1 : attributes.timescale;
  const indexRangeExact = !!attributes.indexRangeExact;
  const availabilityTimeComplete = attributes.availabilityTimeComplete == null ?
    true : attributes.availabilityTimeComplete;

  return objectAssign(
    attributes,
    {
      availabilityTimeComplete,
      indexRangeExact,
      timeline: [],
      timescale,
    }
  );
}
