exports.install = function() {
	ROUTE('/*', view_cms);

	ROUTE('#posts',   view_posts,        ['*Post']);
	ROUTE('#post',    view_posts_detail, ['*Post']);
	ROUTE('#notices', view_notices,      ['*Notice']);

	ROUTE('POST /resicontacts', save_resi_contact);

	ROUTE('/contacts', list_contacts, ['*Contact']);

	ROUTE('/design/', '=design/index');

	ROUTE('/.well-known/acme-challenge/hoC6Y6AuWkCtWXO1vdc2v-LfuatZA1y11mXqF3AngEU', view_ssl_verification);
};

function save_resi_contact(req, res){
	var self = this;
	var nosql = NOSQL('contacts');
	nosql.insert({ firstname: self.req.body.name, lastname : self.req.body.surname, email : self.req.body.email, phone : self.req.body.phone, body : self.req.body.message, city: self.req.body.city, project: self.req.body.project });
	this.res.redirect('/');

}


function list_contacts(){
	var self = this;
	if (F.global.config.users[self.cookie(F.config['admin-cookie'])] == null) {
		self.res.redirect('/');
	}
	else{
		self.sitemap();
		self.$query(self.query, self.callback('contacts'));
	}
}

function view_ssl_verification(){
	var self = this;
	self.plain('hoC6Y6AuWkCtWXO1vdc2v-LfuatZA1y11mXqF3AngEU.hQ-hkKb4yXGpi6NUdY57SzTd7deUrJoeaez6KWoVEpk');
}



function view_cms() {
	this.CMSpage();
}

function view_posts() {
	var self = this;
	var options = {};

	options.page = self.query.page;
	options.published = true;
	options.limit = 10;
	// options.category = 'category_linker';

	self.sitemap();
	self.$query(options, self.callback('posts'));
}

function view_posts_detail(linker) {

	var self = this;
	var options = {};

	options.linker = linker;
	// options.category = 'category_linker';

	self.$workflow('render', options, function(err, response) {

		if (err) {
			self.throw404();
			return;
		}

		self.sitemap();
		self.sitemap_replace(self.sitemapid, response.name);
		self.view('cms/' + response.template, response);
	});
}

function view_notices() {
	var self = this;
	var options = {};

	options.published = true;

	self.sitemap();
	self.$query(options, self.callback('notices'));
}