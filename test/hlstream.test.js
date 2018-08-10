const chai = require('chai');
let assert = chai.assert;

const plugin = require('../index');
const poll = plugin.utils.poll;

let hlstream_app;
let hlstream_performer = {
    name: 'endpoint1',
    protocol: 'filesource', // filesource
    url: '/home/system/workspace/SampleVideo_360x240_30mb.mp4',
    video_codec: 'h264', // optional
    audio_codec: 'aac' // optional
};
let hlstream_audience = {
    name: 'endpoint2',
    protocol : 'hlsservice',
    location : '/home/system/workspace/segment05%d.ts',
    //"target-duration"    : 15,
    //"playlist-location"  : "playlist.m3u8",
    //"playlist-length"    : 5
}

async function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
/*
describe('webstreamer', function(){
    describe('hlstream', function(){
        before(async () => {
            try {
                await plugin.Initialize({
                    rtsp_server : {
                        port : 555
                    }
                });
            }
            catch( err ) {
                throw new Error(err.message);
            }
            hlstream_app = new plugin.HLStream('hlstream');
            await hlstream_app.initialize();
            await hlstream_app.addPerformer(hlstream_performer);
            await hlstream_app.addAudience(hlstream_audience);
            
        });

        after(async () => {
            await hlstream_app.stop();
            await hlstream_app.terminate();
        });

        it('hls slice', async () => {
            await hlstream_app.startup();
            //await sleep(1000);
            //await hlstream_app.addAudience(hlstream_audience);
        });
    });
});
*/
async function test()
{
    try {
        await plugin.Initialize();
    }
    catch( err ) {
        throw new Error(err.message);
    }
    hlstream_app = new plugin.HLStream('hlstream');
    await hlstream_app.initialize();
    await hlstream_app.addPerformer(hlstream_performer);
    await hlstream_app.addAudience(hlstream_audience);
    await hlstream_app.startup();

    //await poll(() => {
    //    return true;
    //}, 100, 10000);
    await hlstream_app.stop();
    await hlstream_app.terminate();
}

test();