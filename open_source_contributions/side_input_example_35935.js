  public static void sideInputPatterns() {
    // This pipeline uses View.asSingleton for a placeholder external service.
    // Run in debug mode to see the output.
    Pipeline p = Pipeline.create();

    // Create a side input that updates every 5 seconds.
    // View as an iterable, not singleton, so that if we happen to trigger more
    // than once before Latest.globally is computed we can handle both elements.
    PCollectionView<Iterable<Map<String, String>>> mapIterable =
        p.apply(GenerateSequence.from(0).withRate(1, Duration.standardSeconds(5L)))
            .apply(
                ParDo.of(
                    new DoFn<Long, Map<String, String>>() {

                      @ProcessElement
                      public void process(
                          @Element Long input,
                          @Timestamp Instant timestamp,
                          OutputReceiver<Map<String, String>> o) {
                        // Replace map with test data from the placeholder external service.
                        // Add external reads here.
                        o.output(PlaceholderExternalService.readTestData(timestamp));
                      }
                    }))
            .apply(
                Window.<Map<String, String>>into(new GlobalWindows())
                    .triggering(Repeatedly.forever(AfterProcessingTime.pastFirstElementInPane()))
                    .discardingFiredPanes())
            .apply(Latest.globally())
            .apply(View.asIterable());

    // Consume side input. GenerateSequence generates test data.
    // Use a real source (like PubSubIO or KafkaIO) in production.
    p.apply(GenerateSequence.from(0).withRate(1, Duration.standardSeconds(1L)))
        .apply(Window.into(FixedWindows.of(Duration.standardSeconds(1))))
        .apply(Sum.longsGlobally().withoutDefaults())
        .apply(
            ParDo.of(
                    new DoFn<Long, KV<Long, Long>>() {

                      @ProcessElement
                      public void process(ProcessContext c, @Timestamp Instant timestamp) {
                        Iterable<Map<String, String>> si = c.sideInput(mapIterable);
                        // Take an element from the side input iterable (likely length 1)
                        Map<String, String> keyMap = si.iterator().next();
                        c.outputWithTimestamp(KV.of(1L, c.element()), Instant.now());

                        LOG.info(
                            "Value is {} with timestamp {}, using key A from side input with time {}.",
                            c.element(),
                            timestamp.toString(DateTimeFormat.forPattern("HH:mm:ss")),
                            keyMap.get("Key_A"));
                      }
                    })
                .withSideInputs(mapIterable));

    p.run();
  }

  /** Placeholder class that represents an external service generating test data. */
  public static class PlaceholderExternalService {

    public static Map<String, String> readTestData(Instant timestamp) {

      Map<String, String> map = new HashMap<>();

      map.put("Key_A", timestamp.toString(DateTimeFormat.forPattern("HH:mm:ss")));

      return map;
    }
  }