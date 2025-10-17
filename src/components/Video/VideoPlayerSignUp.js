import React from 'react';
import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'duk6bc8tg',
  },
});

const VideoPlayerSignUp = () => {
  const cldVid = cld.video('160396821086388');

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <AdvancedVideo
        cldVid={cldVid}
        controls={false}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default VideoPlayerSignUp;
