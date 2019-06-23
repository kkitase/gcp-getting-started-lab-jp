import ssl
import re
import argparse
import apache_beam as beam

argv = None
parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True, help='Output file must be specified')
known_args, pipeline_args = parser.parse_known_args(argv)
p = beam.Pipeline(argv=pipeline_args)
(p
 | 'read' >> beam.io.ReadFromText('gs://dataflow-samples/shakespeare/kinglear.txt')
 | 'split' >> beam.FlatMap(lambda x: re.findall(r'\w+', x))
 | 'count words' >> beam.combiners.Count.PerElement()
 | 'save' >> beam.io.WriteToText(known_args.output))
p.run()
