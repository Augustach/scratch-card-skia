import React, {useRef} from 'react';
import {useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View, ViewProps} from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  useImage,
  ImageShader,
  SkiaDomView,
} from '@shopify/react-native-skia';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

type SizeConfig = {
  size: number;
};

type SquareViewProps = {
  children: (config: SizeConfig) => React.ReactNode;
} & Omit<ViewProps, 'children'>;

const SquareView: React.FC<SquareViewProps> = ({
  children,
  onLayout,
  ...props
}) => {
  const [size, setSize] = useState<number | null>(null);
  const layoutHandler = (event: LayoutChangeEvent) => {
    let {
      nativeEvent: {
        layout: {width, height},
      },
    } = event;
    width = width || Infinity;
    height = height || Infinity;
    onLayout?.(event);
    setSize(Math.min(width, height));
  };

  return (
    <View {...props} onLayout={layoutHandler}>
      {!!size && children({size})}
    </View>
  );
};

type ContentProps = {
  style: ViewProps['style'];
  uri: string;
  strokeWidth: number;
};

const Content: React.FC<ContentProps> = ({uri, style, strokeWidth}) => {
  const canvas = useRef<SkiaDomView>(null);
  const path = useRef(Skia.Path.Make());
  const image = useImage(uri);
  const pan = Gesture.Pan()
    .onStart(({x, y}) => {
      path.current?.moveTo(x, y);
      canvas.current?.redraw();
    })
    .onUpdate(({x, y}) => {
      path.current?.lineTo(x, y);
      canvas.current?.redraw();
    })
    .minDistance(1);

  if (!image) {
    return null;
  }
  return (
    <GestureHandlerRootView style={style}>
      {image && (
        <GestureDetector gesture={pan}>
          <Canvas style={styles.canvas} ref={canvas}>
            <Path path={path.current} strokeWidth={strokeWidth} style="stroke">
              <ImageShader image={image} fit="fill" />
            </Path>
          </Canvas>
        </GestureDetector>
      )}
    </GestureHandlerRootView>
  );
};

type ScratchProps = {
  style: ViewProps['style'];
  strokeWidth: number;
  uri: (config: SizeConfig) => string;
  placeholder: (config: SizeConfig) => React.ReactNode;
};

export const Scratch: React.FC<ScratchProps> = React.memo(
  ({style, uri, placeholder, strokeWidth}) => {
    return (
      <SquareView style={style}>
        {({size}) => (
          <View style={{height: size, width: size}}>
            <Content
              uri={uri({size})}
              style={styles.content}
              strokeWidth={strokeWidth}
            />
            <View style={styles.placeholder}>{placeholder({size})}</View>
          </View>
        )}
      </SquareView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  content: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  placeholder: {
    flex: 1,
    zIndex: 1,
  },
});
