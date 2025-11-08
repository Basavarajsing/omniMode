
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const extractFramesFromVideo = (videoFile: File, framesToExtract: number = 4): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: string[] = [];

    video.onloadedmetadata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const duration = video.duration;
      const interval = duration / (framesToExtract + 1);
      
      for (let i = 1; i <= framesToExtract; i++) {
        const time = interval * i;
        await seekToTime(video, time);
        
        if(ctx){
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
            frames.push(base64);
        }
      }
      
      URL.revokeObjectURL(video.src);
      resolve(frames);
    };

    video.onerror = (e) => {
      reject(new Error('Failed to load video file.'));
    };

    const seekToTime = (videoElement: HTMLVideoElement, time: number) => {
        return new Promise<void>((resolveSeek) => {
            videoElement.currentTime = time;
            videoElement.onseeked = () => {
                resolveSeek();
            };
        });
    };
  });
};
