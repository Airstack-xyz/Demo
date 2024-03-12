export type ImageAspectRatio = '1.91:1' | '1:1';

export type FrameButton = {
  action: string;
  label: string;
  target?: string;
};

export type FrameState = {
  postUrl: string | null;
  buttons: FrameButton[];
  image: string;
  imageAspectRatio?: ImageAspectRatio;
  inputText?: string;
};
