from apache_beam.transforms.periodicsequence import PeriodicImpulse
from apache_beam.transforms.window import TimestampedValue
from apache_beam.transforms import window

# from apache_beam.utils.timestamp import MAX_TIMESTAMP
# last_timestamp = MAX_TIMESTAMP to go on indefninitely

# Any user-defined function.
# cross join is used as an example.
def cross_join(left, rights):
  for x in rights:
    yield (left, x)

# Create pipeline.
pipeline = beam.Pipeline()
side_input = (
    pipeline
    | 'PeriodicImpulse' >> PeriodicImpulse(
        first_timestamp, last_timestamp, interval, True)
    | 'MapToFileName' >> beam.Map(lambda x: src_file_pattern + str(x))
    | 'ReadFromFile' >> beam.io.ReadAllFromText())

main_input = (
    pipeline
    | 'MpImpulse' >> beam.Create(sample_main_input_elements)
    |
    'MapMpToTimestamped' >> beam.Map(lambda src: TimestampedValue(src, src))
    | 'WindowMpInto' >> beam.WindowInto(
        window.FixedWindows(main_input_windowing_interval)))

result = (
    main_input
    | 'ApplyCrossJoin' >> beam.FlatMap(
        cross_join, rights=beam.pvalue.AsIter(side_input)))