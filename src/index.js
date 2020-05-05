function fromArray(
  environmentsAsArrayOfArrays,
  matchUrl = window.location.href
) {
  const pair = environmentsAsArrayOfArrays.find(
    (environment) => matchUrl.startsWith(environment[0])
  );
  if(!pair) {
      throw new Error('No matching environment found.');
  }
  return {
    pair,
    url: pair[0],
    env: pair[1],
  };
}

function fromObject(environments, matchUrl = window.location.href) {
  return fromArray(Object.entries(environments), matchUrl);
}

module.exports = {
    fromArray,
    fromObject
}