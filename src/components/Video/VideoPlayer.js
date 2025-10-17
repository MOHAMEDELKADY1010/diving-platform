import React from 'react';
import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'duk6bc8tg',
  },
});

const VideoPlayer = ({ className, ...rest }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <AdvancedVideo
        cldVid={cld.video('ke9x3yszhi9wucopgon2')}
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
        className={className}
      />
    </div>
  );
};

export default VideoPlayer;
