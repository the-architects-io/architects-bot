const daggerIps = [
	'86.48.5.83', // warly dagger1
	'38.242.153.5', // warly dagger2
	'185.207.251.158', // warly dagger3
	// '89.117.62.212', // bus dagger1
	// '45.85.249.229', // bus dagger2
]


export const getNodeStatuses = async () => {
  const statuses = []
  for (const ip of daggerIps) {
    const { isActive } = await fetch(`http://${ip}:3005/node-check`).then(res => res.json())
    
    statuses.push({ip, isActive})
  }

  return statuses
}