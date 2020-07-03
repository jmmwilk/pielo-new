export let sideBarMenu = {
	'categories': [
		{
			'name': 'Rodzaje Pieluszek',
			'id': 'rodzaje-pieluszek',
			'submenu1': [
				{
					'name': 'All In One',
					'id': 'all-in-one',
				},
				{
					'name': 'Snap In One',
					'id': 'snap-in-one',
				},
				{
					'name': 'Majtki Treningowe',
					'id': 'majtki-treningowe',
				},
				{
					'name': 'Do Kąpieli',
					'id': 'do-kapieli',
				},
				{
					'name': 'Pieluchy Zewnętrzne',
					'id': 'pieluchy-zewnetrzne',
					'issubmenu': true,
					'submenu2': [	
						{
							'name': 'Otulacze'
						},
						{
							'name': 'Gatki'
						},
						{
							'name': 'Longi'
						},
						{
							'name': 'Kieszonki'
						},
						{
							'name': 'Wkładki'
						}
					]
				},
				{
					'name': 'Pieluchy Wewnętrzne',
					'id': 'pieluchy-wewnetrzne',
					'issubmenu': true,
					'submenu2': [	
						{
							'name': 'Formowanki'
						},
						{
							'name': 'Składane'
						},
						{
							'name': 'Prefoldy'
						},
						{
							'name': 'Wkłady Krótkie'
						},
						{
							'name': 'Wkłady Długie'
						},
						{
							'name': 'Wkłady z Burtami'
						},
						{
							'name': 'Boostery'
						},
						{
							'name': 'Inne'
						}
					]
				}
			],
		},
		{
			'name': 'Materiał',
			'id': 'material',
			'submenu1': [
				{
					'name': 'Wełna',
					'id': 'welna',
				},
				{
					'name': 'PUL',
					'id': 'pul',
				},
				{
					'name': 'Bawełna',
					'id': 'bawelna',
				},
				{
					'name': 'Bawełna Organiczna',
					'id': 'bawelna-organiczna',
				},
				{
					'name': 'Bambus',
					'id': 'bambus',
				},
				{
					'name': 'Konopia',
					'id': 'konopia',
				},
				{
					'name': 'Len',
					'id': 'len',
				},
				{
					'name': 'Mikrofibra',
					'id': 'mikrofibra',
				},
				{
					'name': 'Polar',
					'id': 'polar',
				},
				{
					'name': 'Thermo / Coolmax',
					'id': 'thermo/coolmax',
				}
			]
		},
		{
			'name': 'Waga Dziecka',
			'id': 'wagadziecka',
		},
		{
			'name': 'Rozmiar',
			'id': 'rozmiar',
			'submenu1': [
				{
					'name': 'New Born',
					'id': 'new-born',
				},
				{
					'name': 'Mini One Size',
					'id': 'mini-one-size',
				},
				{
					'name': 'One Size',
					'id': 'one-size',
				},
				{
					'name': 'One Size Plus',
					'id': 'one-size-plus',
				},
				{
					'name': 'Small',
					'id': 'small',
				},
				{
					'name': 'Medium',
					'id': 'medium',
				},
				{
					'name': 'Large',
					'id': 'large',
				},
				{
					'name': 'X Large',
					'id': 'x-large',
				}
			]
		},
		{
			'name': 'Producent',
			'id': 'producent',
			'submenu1': [
				{
					'name': 'Puppi',
					'id': 'puppi',
				},
				{
					'name': 'Kokosi',
					'id': 'kokosi',
				},
				{
					'name': 'Xkko',
					'id': 'xkko',
				},
				{
					'name': 'Magabi',
					'id': 'magabi',
				},
				{
					'name': 'JellyFish',
					'id': 'jellyfish',
				},
				{
					'name': 'Sue&Sophie',
					'id': 'sue&sophie',
				},
				{
					'name': 'Fomi',
					'id': 'fomi,'
				}
			]
		}
	]
}

// 		'brand': [
// 			'puppi': {
// 				'name': 'Puppi'
// 			},
// 			'kokosi': {
// 				'name': 'Kokosi'
// 			},
// 			'xkko': {
// 				'name': 'Xkko'
// 			},
// 			'magabi': {
// 				'name': 'Magabi'
// 			},
// 			'jellyfish': {
// 				'name': 'JellyFish'
// 			},
// 			'sue&sophie': {
// 				'name': 'Sue&Sophie'
// 			}
// 		]


// 			'list': [
// 				'newBorn': {
// 					'name': 'New Born'
// 				},
// 				'miniOneSize': {
// 					'name': 'Mini One Size'
// 				},
// 				'oneSize': {
// 					'name': 'One Size'
// 				},
// 				'OneSizePlus': {
// 					'name': 'One Size Plus'
// 				},
// 				'small': {
// 					'name': 'Small'
// 				},
// 				'medium': {
// 					'name': 'Medium'
// 				},
// 				'large': {
// 					'name': 'Large'
// 				},
// 				'xLarge': {
// 					'name': 'X Large'
// 				}
// 			]


// export let sideBarMenu = {
// 	'categories': [
// 		'diapers-types': {
// 			'name': 'Rodzaje Pieluszek',
// 			'list': [
// 				'allInOne': {
// 					'name': 'All In One'
// 				},
// 				'snapInOne': {
// 					'name': 'Snap In One'
// 				},
// 				'trainingPants': {
// 					'name': 'Majtki Treningowe'
// 				},
// 				'swimDiapers': {
// 					'name': 'Do Kąpieli'
// 				},
// 				'outerLayer': {
// 					'name': 'Warstwa Zewnętrzna',
// 					'list': {
// 						'covers': {
// 							'name': 'Otulacze'
// 						},
// 						'soakers': {
// 							'name': 'Gatki'
// 						},
// 						'longies': {
// 							'name': 'Longi'
// 						},
// 						'pockets': {
// 							'name': 'Kieszonki'
// 						},
// 						'inserts': {
// 							'name': 'Wkładki'
// 						}
// 					}
// 				],
// 				'innerLayer': {
// 					'name': 'Warstwa Wewnętrzna',
// 					'list': [
// 						'fitteds': {
// 							'name': 'Formowanki',
// 							'list': {
// 								'pockets': {
// 									'name': 'Kieszonki'
// 								},
// 								'snapInOne': {
// 									'name': 'Snap In One'
// 								},
// 								'others': {
// 									'name': 'Inne'
// 								}
// 							}
// 						},
// 						'flats': {
// 							'name': 'Składane',
// 						},
// 						'prefolds': {
// 							'name': 'Prefoldy'
// 						},
// 						'shortInserts': {
// 							'name': 'Wkłady Krótkie'
// 						},
// 						'longInserts': {
// 							'name': 'Wkłady Długie'
// 						},
// 						'antiLeakInserts': {
// 							'name': 'Wkłady z Burtami'
// 						},
// 						'boosters': {
// 							'name': 'Boosters'
// 						},
// 						'others': {
// 							'name': 'Inne'
// 						}
// 					]
// 				}
// 			}
// 		},
// 		'fabric': {
// 			'name': 'Materiał',
// 			'list': [
// 				'wool': {
// 					'name': 'Wełna'
// 				},
// 				'pul': {
// 					'name': 'PUL'
// 				},
// 				'cotton': {
// 					'name': 'Bawełna'
// 				},
// 				'organic cotton': {
// 					'name': 'Bawełna Organiczna'
// 				},
// 				'bamboo': {
// 					'name': 'Bambus'
// 				},
// 				'hemp': {
// 					'name': 'Konopia'
// 				},
// 				'linen': {
// 					'name': 'Len'
// 				},
// 				'microfiber': {
// 					'name': 'Mikrofibra'
// 				},
// 				'fleece': {
// 					'name': 'Polar'
// 				},
// 				'thermo/coolmax': {
// 					'name': 'Thermo / Coolmax'
// 				}
// 			]
// 		},
// 		'childsWeight': {
// 			'name': 'Waga Dziecka'
// 		},
// 		'size': {
// 			'name': 'Rozmiar',
// 			'list': [
// 				'newBorn': {
// 					'name': 'New Born'
// 				},
// 				'miniOneSize': {
// 					'name': 'Mini One Size'
// 				},
// 				'oneSize': {
// 					'name': 'One Size'
// 				},
// 				'OneSizePlus': {
// 					'name': 'One Size Plus'
// 				},
// 				'small': {
// 					'name': 'Small'
// 				},
// 				'medium': {
// 					'name': 'Medium'
// 				},
// 				'large': {
// 					'name': 'Large'
// 				},
// 				'xLarge': {
// 					'name': 'X Large'
// 				}
// 			]
// 		},
// 		'brand': [
// 			'puppi': {
// 				'name': 'Puppi'
// 			},
// 			'kokosi': {
// 				'name': 'Kokosi'
// 			},
// 			'xkko': {
// 				'name': 'Xkko'
// 			},
// 			'magabi': {
// 				'name': 'Magabi'
// 			},
// 			'jellyfish': {
// 				'name': 'JellyFish'
// 			},
// 			'sue&sophie': {
// 				'name': 'Sue&Sophie'
// 			}
// 		]
// 	]
// }




