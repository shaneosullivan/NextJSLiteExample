interface Props {
  description: string;
}

export default function HeadContent(props: Props) {
  const { description } = props;

  return (
    <>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/favicon.ico" />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar" content="black" />
      <meta name="apple-mobile-web-app-title" content="A simple example" />
      <meta name="theme-color" content="#000000" />

      <meta property="og:title" content="NextJS Example" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://example.com/someImage.png`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://example.com" />
    </>
  );
}
