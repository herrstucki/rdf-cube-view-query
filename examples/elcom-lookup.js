const { LookupSource, Source, View } = require('..')
const namespace = require('@rdfjs/namespace')

const ns = {
  dc: namespace('http://purl.org/dc/elements/1.1/'),
  dh: namespace('http://ns.bergnet.org/dark-horse#'),
  energyPricing: namespace('https://energy.ld.admin.ch/elcom/energy-pricing/dimension/'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: namespace('http://schema.org/'),
  xsd: namespace('http://www.w3.org/2001/XMLSchema#')
}

async function main () {
  // a source manages the SPARQL endpoint information + the named graph
  const source = new Source({
    endpointUrl: 'https://test.lindas.admin.ch/query',
    sourceGraph: 'https://lindas.admin.ch/elcom/electricityprice'
    // user: '',
    // password: ''
  })

  const tariffsCube = await source.cube('https://energy.ld.admin.ch/elcom/energy-pricing/cube')

  // let's create the lookup source based on the existing source
  const lookup = LookupSource.fromSource(source)

  // now let's create a view from the cube, which is required to get the observations
  const tariffsView = View.fromCube(tariffsCube)

  const customView = new View({ parent: source })

  const providerDimension = tariffsView.dimension({ cubeDimension: ns.energyPricing.provider })
  const providerLabelDimension = customView.createDimension({
    source: lookup,
    path: ns.schema.name,
    join: providerDimension,
    as: ns.energyPricing.providerLabel
  })

  customView
    .addDimension(providerDimension)
    .addDimension(providerLabelDimension)

  // and finally let's fetch the observations
  const observations = await customView.observations()
  console.log(`found ${observations.length} observations`)
  console.log(observations)

  // maybe we also want to know how the query looks
  console.log(customView.observationsQuery().query.toString())
}

main()