var IApp = require('./app').IProcessor;

class HLStream extends IApp {
    constructor(webstreamer, name) {
        super(webstreamer, name, 'HLStream');
        this.type = 'HLStream';
        this.name = name;
        this.webstreamer = webstreamer;
        this.performer = null;
        this.audiences = [];
    }
    startup() {
        return this.call('startup');
    }
    stop() {
        return this.call('stop');
    }
    addPerformer(endpoint) {
        if (endpoint.protocol != 'filesource') {
            this.reject(`It's not a performer endpoint!`);
            return;
        }
        if (this.performer != null) {
            this.reject(`There's already a performer now!`);
            return;
        }
        if (!endpoint.url || (!endpoint.video_codec && !endpoint.audio_codec)) {
            this.reject(`The information of the endpoint is not completed!`);
            return;
        }

        return this.call('add_performer', endpoint)
            .then(() => {
                this.performer = endpoint;
            })
            .catch((err) => {
                this.reject(`Add performer failed! ${err}`);
            });
    }
    addAudience(endpoint) {
        if (this.performer == null) {
            this.reject(`There's no performer, add one first!`);
            return;
        }
        if (!endpoint.protocol || !endpoint.name) {
            this.reject(`Endpoint with invalid parameters!`);
            return;
        }
        for (var i = 0; i < this.audiences.length; ++i) {
            if (this.audiences[i].name == endpoint.name) {
                this.reject(`Audiences has been added!`);
                return;
            }
        }
        return this.call('add_audience', endpoint)
            .then(() => {
                this.audiences.push(endpoint);
            })
            .catch((err) => {
                this.reject(`Add audience failed! ${err}`);
            });
    }
    removeAudience(endpoint_name) {
        for (var i = 0; i < this.audiences.length; ++i) {
            if (this.audiences[i].name == endpoint_name) {
                break;
            }
        }
        if (i >= this.audiences.length) {
            this.reject(`Audience not found or has been removed!`);
            return ;
        }

        return this.call('remove_audience', this.audiences[i])
            .then(() => {
                this.audiences.splice(i, 1);
                return 'remove audience successfully!';
            })
            .catch((err) => {
                self.reject(`Remove audience failed! ${err}`);
            });
    }
}

module.exports = {
    HLStream: HLStream
};