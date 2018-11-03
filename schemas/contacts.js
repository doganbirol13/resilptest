NEWSCHEMA('Contact').make(function(schema) {

	schema.define('firstname', 'Capitalize(40)', true);
	schema.define('lastname', 'Capitalize(40)', true);
	schema.define('email', 'Email', true);
	schema.define('body', String, true);
	schema.define('phone', 'Phone');
	//Resi additions
	schema.define('city', String, true);
	schema.define('project', String, true);

	schema.setQuery(function(error, options, callback) {

		// pagination
		options.page = U.parseInt(options.page) - 1;
		options.max = U.parseInt(options.max, 20);

		// if page not specified set it to 0
		if (options.page < 0)
			options.page = 0;
		
		// number of items to return
		var take = U.parseInt(options.max);

		// number of items to skip
		var skip = U.parseInt(options.page * options.max);

		// NOSQL is total.js embedded database
		// https://docs.totaljs.com/latest/en.html#api~Database
		var filter = NOSQL('contacts').find();

		filter.take(take);
		filter.skip(skip);

		if(options.sort) filter.sort(options.sort);

		filter.callback(function(err, docs, count) {
			
			// let's create object which will be returned
			var data = {};
			data.count = count;
			data.items = docs;
			data.limit = options.max;
			data.pages = Math.ceil(data.count / options.max) || 1;
			data.page = options.page + 1;
			callback(data);
		});
	});


	schema.setSave(function($) {

		var model = $.model;
		model.id = UID();
		model.ip = $.ip;
		model.datecreated = F.datetime;

		var nosql = NOSQL('contactforms');
		nosql.insert(model.$clean());
		nosql.counter.hit('all');

		$.success();

		EMIT('contacts.save', model);

		// Sends email
		MAIL(F.global.config.emailcontactform, '@(Contact form #{0})'.format(model.id), '=?/mails/contact', model, $.language).reply(model.email, true);

		// Events
		$SAVE('Event', { type: 'contactforms/add', user: $.user ? $.user.name : '', body: model.firstname + ' ' + model.lastname, id: model.id }, NOOP, $);
	});

	// Stats
	schema.addWorkflow('stats', function($) {
		NOSQL('contactforms').counter.monthly('all', $.callback);
	});
});