// Model tests
// globals danilo

window.specs.push(function(danilo){

  describe('danilo', function() {
    var User
      , pippo
      , pluto;
    
    // Defining a User model
    User = (function() {
      var User = function() {
        return User.__super__.constructor.apply(this, arguments);
      }
      __extends(User, danilo.Model);

      User.prototype.url = '/user/';
      User.prototype.autoValidate = true;
      User.prototype.attrs = {
        password: 'password',
        lengthOfMyUsername: -1,
        username: {
          defaultValue: 'Default username',
          reactive: true,
          validators: {
            minLength: 5,
            maxLength: 100,
            firstLetterIsUppercase: function(attributeValue) {
              return attributeValue[0].toUpperCase() === attributeValue[0];
            }
          }
        }
      };
      return User;
    })();
    
    pippo = new User();
    pluto = new User({
      username: 'Plutone'
    });
    
    beforeEach(function() {
      spyOn(window, "alert").andCallFake(console.log);
    });
    
    it('should export a danilo.Model object', function() {
      expect(danilo.Model).to.be.a("function");
    });
    
    describe('User', function(){
      it('should define have some methods', function() {
        expect(User).to.be.a("function");
        expect(pippo.get).to.be.a("function");
        expect(pippo.set).to.be.a("function");
      });
      
      it('should have a default value as username', function() {
        expect(pippo.get('username')).to.be(User.prototype.attrs.username.defaultValue);
      });
      
      it('should have a default value as password', function() {
        expect(pippo.get('password')).to.be(User.prototype.attrs.password);
      });
      
      describe('#set', function(){
        it('should set pippo username', function() {
          pippo.set('username', 'Piatto');
          expect(pippo.get('username')).to.be('Piatto');
        });
        
        it('should leave unchanged other usernames', function() {
          expect(pluto.get('username')).to.be('Plutone');
        });
        
      });
      
      
    });
    
  });

});
