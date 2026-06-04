/*
   Copyright 2016 kanreisa

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import * as stream from "stream";
import _ from "./_";
import * as common from "./common";
import * as apid from "../../api";
import ServiceItem from "./ServiceItem";
import TSFilter from "./TSFilter";
import TLVFilter from "./TLVFilter";

export default class ChannelItem {
    readonly name: string;
    readonly type: apid.ChannelType;
    readonly channel: string;
    readonly satellite?: string;
    readonly space?: number;
    readonly freq?: number;
    readonly polarity?: "H" | "V";
    readonly tsmfRelTs: number;
    readonly commandVars: apid.ConfigChannelsItem["commandVars"];

    constructor(config: apid.ConfigChannelsItem) {
        this.name = config.name;
        this.type = config.type;
        this.channel = config.channel;
        this.satellite = config.satellite;
        this.space = config.space;
        this.freq = config.freq;
        this.polarity = config.polarity;
        this.tsmfRelTs = config.tsmfRelTs;
        this.commandVars = config.commandVars;
    }

    toJSON(): apid.ConfigChannelsItem {
        return {
            type: this.type,
            channel: this.channel,
            name: this.name,
            satellite: this.satellite,
            space: this.space,
            freq: this.freq,
            polarity: this.polarity,
            tsmfRelTs: this.tsmfRelTs,
            commandVars: this.commandVars
        };
    }

    getServices(): ServiceItem[] {
        return _.service.findByChannel(this);
    }

    getStream(user: common.User, output: stream.Writable): Promise<TSFilter | TLVFilter> {
        return _.tuner.initChannelStream(this, user, output);
    }
}
