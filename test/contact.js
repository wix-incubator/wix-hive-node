/**
* Created by Karen_Cohen on 8/25/14.
*/

var should = require('should');
var assert = require('assert');
var expect = require('expect.js');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_KEY = config.appKey;
var INSTANCE_ID = config.instanceId;

describe('Contact', function() {
    this.timeout(10000);
    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

    describe('Properties', function() {
        describe('Name', function() {
            it('should ignore an attempt to be set null', function(done) {

                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.name(null);
                contact.name().first().should.be.eql('Karen');
                contact.name().last().should.be.eql('Meep');
                done();
            });
            it('should allow setters', function(done) {

                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.name().prefix('Sir');
                contact.name().first('Mix');
                contact.name().middle('A');
                contact.name().last('Lot');
                contact.name().suffix('The III');
                contact.name().prefix().should.be.eql('Sir');
                contact.name().first().should.be.eql('Mix');
                contact.name().middle().should.be.eql('A');
                contact.name().last().should.be.eql('Lot');
                contact.name().suffix().should.be.eql('The III');
                done();
            });
        });

        describe('Emails', function() {
            it('should allow edit', function(done) {

                var contact = api.Contacts.newContact();
                contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                contact.addEmail({tag: 'work', email: 'karen@home.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                var emails = contact.emails();
                emails[1].tag('home');
                contact.emails()[1].tag().should.be.eql('home');
                done();
            });
            it('should throw exception with creating email without email property', function(done) {

                var contact = api.Contacts.newContact();
                expect(contact.addEmail).withArgs({tag: 'wix', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING}).to.throwException();
                done();
            });
            it('should throw exception with creating email without tag property', function(done) {

                var contact = api.Contacts.newContact();
                expect(contact.addEmail).withArgs({email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING}).to.throwException();
                done();
            });
            it('should not throw exception with creating email without email status property', function(done) {

                var contact = api.Contacts.newContact();
                contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                done();
            });
            it('should ignore when setting tag property as null', function(done) {

                var contact = api.Contacts.newContact();
                contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                var email = contact.emails()[0];
                email.tag(null);
                email.tag().should.be.eql('work');
                done();
            });
            it('should ignore when setting email property as null', function(done) {

                var contact = api.Contacts.newContact();
                contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                var email = contact.emails()[0];
                email.email(null);
                email.email().should.be.eql('karenc@wix.com');
                done();
            });
        });
    });

    describe('Methods', function() {

        describe('UpdateFields', function() {
            describe('updateName', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.name({first: 'Karen', last: 'Meep'});
                    expect(contact.updateName).to.throwException();
                    done();
                });

                it('should edit name', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.name({first: 'Karen', last: 'Meep'});
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.name().prefix('Sir');
                                    contact.name().first('Mix');
                                    contact.name().middle('A');
                                    contact.name().last('Lot');
                                    contact.name().suffix('The III');
                                    contact.updateName().then(
                                        function (contact) {
                                            contact.name().prefix().should.be.eql('Sir');
                                            contact.name().first().should.be.eql('Mix');
                                            contact.name().middle().should.be.eql('A');
                                            contact.name().last().should.be.eql('Lot');
                                            contact.name().suffix().should.be.eql('The III');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updatePicture', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
                    expect(contact.updatePicture).to.throwException();
                    done();
                });

                it('should edit picture', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.picture('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
                                    contact.updatePicture().then(
                                        function (contact) {
                                            contact.picture().should.be.eql('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateCompany', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.company({role: 'MyRole', name: 'MyName'});
                    expect(contact.updateCompany).to.throwException();
                    done();
                });

                it('should edit company', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.company({role: 'MyRole', name: 'MyName'});
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.company({role: 'MyRole1', name: 'MyName1'});
                                    contact.updateCompany().then(
                                        function (contact) {
                                            contact.company().role().should.be.eql('MyRole1');
                                            contact.company().name().should.be.eql('MyName1');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateEmail', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                    var email = contact.emails()[0];
                    expect(contact.updateEmail).withArgs(email).to.throwException();
                    done();
                });

                it('should throw error when not given an email', function (done) {
                    var contact = api.Contacts.newContact();
                    expect(contact.updateEmail).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved Email', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                                    expect(contact.updateEmail).withArgs(contact.emails()[0]).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit email for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    var email = contact.emails()[0];
                                    email.email('karen@home.com');
                                    email.tag('home');
                                    email.emailStatus(api.Contacts.EMAIL_STATUS_TYPES.OPT_OUT);
                                    contact.updateEmail(email).then(
                                        function (contact) {
                                            var email = contact.emails()[0];
                                            email.email().should.be.eql('karen@home.com');
                                            email.tag().should.be.eql('home');
                                            email.emailStatus().should.be.eql(api.Contacts.EMAIL_STATUS_TYPES.OPT_OUT);
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    ).done(null, done);
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateAddress', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addAddress(
                        {
                            tag: 'work',
                            address: '500 Terry A Francois',
                            city: 'San Francisco',
                            neighborhood: 'Wixville',
                            region: 'CA',
                            country: 'USA',
                            postalCode: '94158'
                        });
                    var address = contact.addresses()[0];
                    expect(contact.updateAddress).withArgs(address).to.throwException();
                    done();
                });

                it('should throw error when not given an address', function (done) {
                    var contact = api.Contacts.newContact();
                    expect(contact.updateAddress).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved Address', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    contact.addAddress(
                                        {
                                            tag: 'work',
                                            address: '500 Terry A Francois',
                                            city: 'San Francisco',
                                            neighborhood: 'Wixville',
                                            region: 'CA',
                                            country: 'USA',
                                            postalCode: '94158'
                                        });
                                    var address = contact.addresses()[0];
                                    expect(contact.updateAddress).withArgs(address).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit address for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addAddress(
                        {
                            tag: 'work',
                            address: '500 Terry A Francois',
                            city: 'San Francisco',
                            neighborhood: 'Awesomeville',
                            region: 'CA',
                            country: 'USA',
                            postalCode: '94158'
                        });
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    var address = contact.addresses()[0];
                                    address.id().should.be.a.Number;
                                    address.address('235 W 23rd St');
                                    address.city('NYC');
                                    address.neighborhood('Wixville');
                                    address.region('NY');
                                    address.postalCode('10011');
                                    address.tag('Wix NYC Lounge');
                                    contact.updateAddress(address).then(
                                        function (contact) {
                                            var address = contact.addresses()[0];
                                            should.exist(address.id());
                                            address.id().should.be.a.Number;
                                            should.exist(address.address());
                                            address.address().should.be.eql('235 W 23rd St');
                                            should.exist(address.city());
                                            address.city().should.be.eql('NYC');
                                            address.neighborhood().should.be.eql('Wixville');
                                            address.region().should.be.eql('NY');
                                            address.postalCode().should.be.eql('10011');
                                            address.tag().should.be.eql('Wix NYC Lounge');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    ).done(null, done);
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updatePhone', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    var phone = contact.phones()[0];
                    expect(contact.updatePhone).withArgs(phone).to.throwException();
                    done();
                });

                it('should throw error when not given an phone', function (done) {
                    var contact = api.Contacts.newContact();
                    expect(contact.updatePhone).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved Phone', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                                    var phone = contact.phones()[0];
                                    expect(contact.updatePhone).withArgs(phone).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit phone for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    var phone = contact.phones()[0];
                                    phone.id().should.be.a.Number;
                                    phone.phone('+1 646-862-0833');
                                    phone.tag('Wix NYC Lounge');
                                    contact.updatePhone(phone).then(
                                        function (contact) {
                                            var phone = contact.phones()[0];
                                            phone.id().should.be.a.Number;
                                            phone.phone().should.be.eql('+1 646-862-0833');
                                            phone.tag().should.be.eql('Wix NYC Lounge');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            );
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateUrl', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                    var url = contact.urls()[0];
                    expect(contact.updateUrl).withArgs(url).to.throwException();
                    done();
                });

                it('should throw error when not given an url', function (done) {
                    var contact = api.Contacts.newContact();
                    expect(contact.updateUrl).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved Url', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                                    var url = contact.urls()[0];
                                    expect(contact.updateUrl).withArgs(url).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit url for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    var url = contact.urls()[0];
                                    url.id().should.be.a.Number;
                                    url.url('http://www.wixlounge.com/');
                                    url.tag('Wix NYC Lounge');
                                    contact.updateUrl(url).then(
                                        function (contact) {
                                            var url = contact.urls()[0];
                                            url.id().should.be.a.Number;
                                            url.url().should.be.eql('http://www.wixlounge.com/');
                                            url.tag().should.be.eql('Wix NYC Lounge');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            );
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateDate', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                    var date = contact.dates()[0];
                    expect(contact.updateDate).withArgs(date).to.throwException();
                    done();
                });

                it('should throw error when not given an date', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    expect(contact.updateDate).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved Date', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                                    var date = contact.dates()[0];
                                    expect(contact.updateDate).withArgs(date).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit date for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    var date = contact.dates()[0];
                                    date.id().should.be.a.Number;
                                    date.date('1995-11-05T13:15:30Z');
                                    date.tag('A year later');
                                    contact.updateDate(date).then(
                                        function (contact) {
                                            var date = contact.dates()[0];
                                            date.id().should.be.a.Number;
                                            var dExpected = new Date('1995-11-05T13:15:30Z').toString();
                                            var dActual = new Date(date.date().toString()).toString();
                                            dExpected.should.be.eql(dActual);
                                            date.tag().should.be.eql('A year later');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            );
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateNote', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    contact.addNote({ content: 'I like big Wix and I cannot lie'});
                    var note = contact.notes()[0];
                    expect(contact.updateNote).withArgs(note).to.throwException();
                    done();
                });

                it('should throw error when not given an note', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    expect(contact.updateNote).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved Note', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addNote({ content: 'I like big Wix and I cannot lie'});
                                    var note = contact.notes()[0];
                                    expect(contact.updateNote).withArgs(note).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit note for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    contact.addNote({ content: 'I like big Wix and I cannot lie'});
                                    var note = contact.notes()[0];
                                    contact.postNote(note).then(
                                        function(contact){
                                            var note = contact.notes()[0];
                                            note.content('I like big butts and I cannot lie');
                                            contact.updateNote(note).then(
                                                function (contact) {
                                                    var note = contact.notes()[0];
                                                    note.id().should.be.a.Number;
                                                    note.content().should.be.eql('I like big butts and I cannot lie');
                                                    done();
                                                },
                                                function (error) {
                                                    done(error);
                                                }
                                            ).done(null, done);

                                        },
                                        function(error){
                                            done(error);
                                        }
                                    ).done(null, done);
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('updateCustomField', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                    var customField = contact.customFields()[0];
                    expect(contact.updateCustomField).withArgs(customField).to.throwException();
                    done();
                });

                it('should throw error when not given an customField', function (done) {
                    var contact = api.Contacts.newContact();
                    expect(contact.updateCustomField).to.throwException();
                    done();
                });

                it('should throw error when given an unsaved customField', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                                    var customField = contact.customFields()[0];
                                    expect(contact.updateCustomField).withArgs(customField).to.throwException();
                                    done();
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });

                it('should edit customField for Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {

                                    contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                                    var cf = contact.customFields()[0];
                                    contact.postCustomField(cf).then(
                                        function(contact) {
                                            var customField = contact.customFields()[0];
                                            customField.id().should.be.a.Number;
                                            customField.field('Party Time');
                                            customField.value('Excellent');
                                            contact.updateCustomField(customField).then(
                                                function (contact) {
                                                    var customField = contact.customFields()[0];
                                                    customField.id().should.be.a.Number;
                                                    customField.field().should.be.eql('Party Time');
                                                    customField.value().should.be.eql('Excellent');
                                                    done();
                                                },
                                                function (error) {
                                                    done(error);
                                                }
                                            );
                                        },
                                        function(error){
                                            throw(error);
                                        }
                                    );
                                },
                                function (error) {
                                    done(error);
                                }
                            );
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

        });

        describe('PostFields', function() {

            describe('postEmail', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                    var email = contact.emails()[0];
                    expect(contact.postEmail).withArgs(email).to.throwException();
                    done();
                });

                it('should add new email to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                                    var email = contact.emails()[0];
                                    contact.postEmail(email).then(
                                        function (contact) {
                                            var email = contact.emails()[0];
                                            email.id().should.be.a.Number;
                                            email.id().should.not.be.eql(undefined);
                                            email.email().should.be.eql('karenc@wix.com');
                                            email.tag().should.be.eql('work');
                                            email.emailStatus().should.be.eql(api.Contacts.EMAIL_STATUS_TYPES.RECURRING);
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    ).done(null, done);
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('postAddress', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addAddress(
                        {
                            tag: 'work',
                            address: '500 Terry A Francois',
                            city: 'San Francisco',
                            neighborhood: 'Wixville',
                            region: 'CA',
                            country: 'USA',
                            postalCode: '94158'
                        });
                    var address = contact.addresses()[0];
                    expect(contact.postAddress).withArgs(address).to.throwException();
                    done();
                });

                it('should add new address to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addAddress(
                                        {
                                            tag: 'work',
                                            address: '500 Terry A Francois',
                                            city: 'San Francisco',
                                            neighborhood: 'Awesomeville',
                                            region: 'CA',
                                            country: 'USA',
                                            postalCode: '94158'
                                        });
                                    var address = contact.addresses()[0];
                                    contact.postAddress(address).then(
                                        function (contact) {
                                            var address = contact.addresses()[0];
                                            address.id().should.be.a.Number;
                                            should.exist(address.id());
                                            address.id().should.not.be.eql(undefined);
                                            address.tag().should.be.eql('work');
                                            should.exist(address.address());
                                            address.address().should.be.eql('500 Terry A Francois');
                                            address.neighborhood().should.be.eql('Awesomeville');
                                            should.exist(address.city());
                                            address.city().should.be.eql('San Francisco');
                                            address.region().should.be.eql('CA');
                                            address.country().should.be.eql('USA');
                                            address.postalCode().should.be.eql('94158');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    ).done(null, done);
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('postPhone', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    var phone = contact.phones()[0];
                    expect(contact.postPhone).withArgs(phone).to.throwException();
                    done();
                });

                it('should add new phone to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                                    var phone = contact.phones()[0];
                                    contact.postPhone(phone).then(
                                        function (contact) {
                                            var phone = contact.phones()[0];
                                            phone.id().should.be.a.Number;
                                            phone.id().should.not.be.eql(undefined);
                                            phone.tag().should.be.eql('work');
                                            phone.phone().should.be.eql('+1-415-639-5555');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    )
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('postUrl', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addUrl({ tag: 'work', url: '+1-415-639-5555'});
                    var url = contact.urls()[0];
                    expect(contact.postUrl).withArgs(url).to.throwException();
                    done();
                });

                it('should add new url to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                                    var url = contact.urls()[0];
                                    contact.postUrl(url).then(
                                        function (contact) {
                                            var url = contact.urls()[0];
                                            url.id().should.be.a.Number;
                                            url.id().should.not.be.eql(undefined);
                                            url.tag().should.be.eql('work');
                                            url.url().should.be.eql('http://www.wix.com/');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    )
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('postDate', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                    var date = contact.dates()[0];
                    expect(contact.postDate).withArgs(date).to.throwException();
                    done();
                });

                it('should add new date to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                                    var date = contact.dates()[0];
                                    contact.postDate(date).then(
                                        function (contact) {
                                            var date = contact.dates()[0];
                                            date.id().should.be.a.Number;
                                            date.id().should.not.be.eql(undefined);
                                            date.tag().should.be.eql('work');
                                            var dExpected = new Date('1994-11-05T13:15:30Z').toString();
                                            var dActual = new Date(date.date().toString()).toString();
                                            dExpected.should.be.eql(dActual);
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    )
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('postNote', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addNote({ content: 'Your rent is due'});
                    var note = contact.notes()[0];
                    expect(contact.postNote).withArgs(note).to.throwException();
                    done();
                });

                it('should add new note to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addNote({ content: 'Your rent is due'});
                                    var note = contact.notes()[0];
                                    contact.postNote(note).then(
                                        function (contact) {
                                            var note = contact.notes()[0];
                                            should.exist(note.id());
                                            note.id().should.be.a.Number;
                                            note.id().should.not.be.eql(undefined);
                                            should.exist(note.modifiedAt());
                                            note.modifiedAt().should.not.be.eql(undefined);
                                            note.content().should.be.eql('Your rent is due');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    ).done(null, done);
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });

            describe('postCustomField', function () {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addCustomField({ field: 'whats the time?', value: 'Hammer time!'});
                    var customField = contact.customFields()[0];
                    expect(contact.postCustomField).withArgs(customField).to.throwException();
                    done();
                });

                it('should add new customField to Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                    api.Contacts.create(contact).then(
                        function (contactId) {
                            api.Contacts.getContactById(contactId).then(
                                function(contact) {
                                    contact.addCustomField({ field: 'whats the time?', value: 'Hammer time!'});
                                    var customField = contact.customFields()[0];
                                    contact.postCustomField(customField).then(
                                        function (contact) {
                                            var customField = contact.customFields()[0];
                                            customField.id().should.be.a.Number;
                                            customField.id().should.not.be.eql(undefined);
                                            customField.field().should.be.eql('whats the time?');
                                            customField.value().should.be.eql('Hammer time!');
                                            done();
                                        },
                                        function (error) {
                                            done(error);
                                        }
                                    )
                                },
                                function (error) {
                                    done(error);
                                }
                            ).done(null, done);
                        },
                        function (error) {
                            done(error);
                        }
                    ).done(null, done);
                });
            });
        });
    });

    describe('Activities', function() {

        describe('AddActivity', function() {
            var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
            activity.activityLocationUrl = "http://www.wix.com";
            activity.activityDetails.summary = "test";
            activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
            activity.activityInfo = { album: { name: 'Wix', id: '1234' } };

            it('should throw error when trying to post against a Contact which has not been saved', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                expect(contact.addActivity).withArgs(activity, api).to.throwException();
                done();
            });
            it('should throw error when not providing a Wix API', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                expect(contact.addActivity).withArgs(activity).to.throwException();
                done();
            });
            it('should add Activity for Contact without throwing error', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {
                        api.Contacts.getContactById(contactId).then(
                            function(contact) {
                                contact.addActivity(activity, api).then(
                                    function(data){
                                        data.activityId.should.be.a.String;
                                        data.contactId.should.be.a.String;
                                        data.contactId.should.be.eql(contact.id().id());
                                        done();
                                    },
                                    function(error){
                                        done(error);
                                    }
                                );
                            },
                            function(error){
                                done(error);
                            }
                        ).done(null, done);
                    },
                    function(error){
                        done(error);
                    }
                ).done(null, done);
            });
        });

        describe('GetActivities', function() {
            this.timeout(10000);

            var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
            activity.activityLocationUrl = "http://www.wix.com";
            activity.activityDetails.summary = "test";
            activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
            activity.activityInfo = { album: { name: 'Wix', id: '1234' } };

            it('should not throw errors when no options are given', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {
                        api.Contacts.getContactById(contactId).then(
                            function(contact) {
                                contact.addActivity(activity, api).then(
                                    function(data){
                                        data.activityId.should.be.a.String;
                                        data.contactId.should.be.a.String;
                                        data.contactId.should.be.eql(contact.id().id());

                                        contact.getActivities().then(
                                            function(pagingActivitiesResult){
                                                var activities = pagingActivitiesResult.results;
                                                activities.should.have.length(1);
                                                should.exist(pagingActivitiesResult.pageSize);
                                                done();
                                            },
                                            function(error){
                                                done(error);
                                            }
                                        ).done(null, done);
                                    },
                                    function(error){
                                        done(error);
                                    }
                                ).done(null, done);
                            },
                            function(error){
                                done(error);
                            }
                        ).done(null, done);
                    },
                    function(error){
                        done(error);
                    }
                ).done(null, done);
            });

            it('should not throw errors when options are given', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {
                        api.Contacts.getContactById(contactId).then(
                            function(contact) {
                                contact.addActivity(activity, api).then(
                                    function(data){
                                        data.activityId.should.be.a.String;
                                        data.contactId.should.be.a.String;
                                        data.contactId.should.be.eql(contact.id().id());

                                        var ONE_HOUR = 60 * 60 * 1000;
                                        var oneHourAgo = new Date(new Date().getTime() - ONE_HOUR);

                                        contact.getActivities(null,
                                            {
                                                from: oneHourAgo.toISOString(),
                                                until: new Date().toISOString(),
                                                activityTypes: [api.Activities.TYPES.ALBUM_FAN.name, api.Activities.TYPES.ALBUM_SHARE.name],
                                                scope: 'app',
                                                pageSize: 50
                                            }).then(
                                            function(pagingActivitiesResult){
                                                var activities = pagingActivitiesResult.results;
                                                activities.should.have.length(1);
                                                should.exist(pagingActivitiesResult.pageSize);
                                                should.exist(pagingActivitiesResult.pageSize);
                                                assert(pagingActivitiesResult.pageSize <= 50);
                                                done();
                                            },
                                            function(error){
                                                done(error);
                                            }
                                        ).done(null, done);
                                    },
                                    function(error){
                                        done(error);
                                    }
                                ).done(null, done);
                            },
                            function(error){
                                done(error);
                            }
                        ).done(null, done);
                    },
                    function(error){
                        done(error);
                    }
                ).done(null, done);
            });
        });
    });
});
