module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
          hermesParser: {
            enableHermes: false, // Disable Hermes
          },
        },
      }),
    },
  };
  