angular.module('appDynApp')

    .controller('listDesignOfFormCreateCtrl', ['$scope', '$http', '$location','$modal', function($scope, $http, $location,modal) {

				// temporary node
				$scope.temporaryNode = {
					children : [],
					clearList:"",
					checked:false
				};
				$scope.tags = [];
				
				$scope.heading="Create Forms";
					
				$scope.disableAddChild=false;
				
				$scope.roleList ={
						   "rootnode": {
							  "children" : [], 
						      "datatype" : "Composite-selectsingle",
						      "id" : "fuelload",
						      "label" : "Fuel Load",
						      "clearList":"",
						      "listItems":[]
				} };

				if($location.search().formid != undefined){
					//$http.get('./sample-fual-load.json').then(function(res) {
					//	$scope.roleList = res.data;
					//});
					$http.get('./getDesignOfForm/' + $location.search().formid).then(function(res) {
						$scope.roleList = res.data;
						console.log($scope.roleList)
						if($scope.roleList.rootnode.datatype =="" || $scope.roleList.rootnode.datatype==""){
							
						}
						$scope.heading="Edit Form";
					});
				};

				$scope.done = function() {
					/* reset */
					/*$scope.SaveIndividualDesignOfForm();*/
					$scope.mytree.currentNode.selected = undefined;
					$scope.mytree.currentNode.clearList=undefined;
					$scope.mytree.currentNode = undefined;
					$scope.mode = undefined;
				};
				
				//function to save individual DesignOfForm
				$scope.SaveAsNode=function(flag){
					var nodeid='';
					var nodedata='';
					if(flag=='new'){
						nodeid=$scope.temporaryNode.id;
						nodedata=$scope.temporaryNode;
					}
					else{
						nodeid=$scope.mytree.currentNode.id;
						nodedata=$scope.mytree.currentNode;
					}
					$http.post('./saveReuseableDesignOfForm/' + nodeid,nodedata).
					success(function(data){
						alert('success');
					}).
					error(function(err){
						alert('failed');
					})
				};

				$scope.ShowExistingDesignOfForm=function(){
					$scope.resuseDesignOfFormList='';
					 $http.get('./getAllDesignOfForm').success(function (data, status, headers, config) {
						 	$scope.resuseDesignOfFormList=data;
							$scope.ShowDialog($scope.resuseDesignOfFormList);
			           }).error(function (data, status, headers, config) {
			        	   alert("Can't retrieve DesignOfForm list!");
			           });
				};
				
				$scope.ShowDialog=function(DesignOfFormlist){
					 var modalInstance = modal.open({
				            templateUrl: 'views/navigation/formbuilder-ModalDialog.html',
				            scope: $scope,
				            size: 'md',
				            backdropClick: false,
				            controller: modalExistingDesignOfForm,
				            resolve:{
					               'reusableDesignOfForm':function(){
					            		return  DesignOfFormlist;
					                }
				            }
				        });
					 modalInstance.result.then(
				                function (callback) {
				                   //$scope.addPatternCallback(callback);
				                }, function (callback) {
				                 console.log(callback);
				      });
				};
				
				$scope.$on('AddDesignOfForm',function(event,data){
					$scope.mode='addChild';
					//newChildToAdd=JSON.parse('{"children": [],"datatype": "Composite-selectsingle","label": "lbstank","id": "lbstank"}');
					$scope.temporaryNode=data;
				});
			
				
				function modalExistingDesignOfForm($scope,$modalInstance,reusableDesignOfForm){
					$scope.tabs=[{'name':'DesignOfForm Name'},{'name':'DesignOfForm View'}];
					$scope.modalname="View DesignOfForm";
					$scope.showassign=true;
					$scope.active = {
				        		DesignOfFormName: true,DesignOfFormView:false
				        };
					$scope.jsonToAssociate="";
					$scope.viewJson='';
					$scope.reusableAttrList=reusableDesignOfForm;
					console.log($scope.reusableAttrList);
					$scope.cancel=function(){
						$modalInstance.dismiss('cancel');
					};
					
					$scope.PassSelectedDesignOfForm=function(){
						$scope.$emit('AddDesignOfForm',$scope.jsonToAssociate);
						$modalInstance.dismiss('cancel');
					};
					
					$scope.AttrToPassToParent=function(attrdetails){
						$scope.active={};
						$scope.formClicked="";
						$scope.formClicked=attrdetails.name;
						$scope.active['DesignOfFormView']=true;
						$scope.jsonToAssociate=JSON.parse(attrdetails);
					};
				}
				
				
				$scope.addChildDone = function() {
					/* add child */
					var emptyArray=[];
					console.log($scope.temporaryNode);
					if ($scope.temporaryNode.id && $scope.temporaryNode.label) {
						//assign children while adding new node 
						if($scope.disabledataTypes.indexOf($scope.temporaryNode.datatype)>'-1'){
							$scope.temporaryNode.children=emptyArray;
						}
						console.log($scope.temporaryNode);
						$scope.mytree.currentNode.children.push(angular
								.copy($scope.temporaryNode));
					}

					/* reset */
					$scope.temporaryNode.id = "";
					$scope.temporaryNode.label = "";

					$scope.done();

				};

				 $scope.saveDesignOfForm = function() {
							$http.post('./saveDesignOfForm/', $scope.roleList).
							  success(function(data, status, headers, config) {
								  if(data == "0"){
									  alert('dublicate Form identified. Insertion failed');
								  }
								  else{
									  alert('success')
								  }
								  }).
								  error(function(data, status, headers, config) {
								    // called asynchronously if an error occurs
								    // or server returns response with an error status.
									    alert('failed')
								  })
					};
					
					$scope.UpdateDesignOfForm=function(){
						$http.post('./updateDesignOfForm/'+$location.search().formid, $scope.roleList).
						success(function(data){
							alert('success');
						}).
						error(function(data, status, headers, config){
							alert('failed');
						})
					};
				
				$scope.disabledataTypes=['Composite-selectsingle','Composite-selectall'];
				$scope.ShowChecked=['radio','checkbox'];
				$scope.clearList=['singleselect','multipleselect'];
				
				$scope.DisableAddChild=function(flag){
					var dataTypeToCheck="";
					if(flag == 'new'){
						dataTypeToCheck=$scope.temporaryNode.datatype;
						$scope.temporaryNode.clearList="";
							if($scope.clearList.indexOf(dataTypeToCheck)>'-1'){
								$scope.temporaryNode.clearList=true;
							}
							$scope.temporaryNode.checked="";
							if($scope.ShowChecked.indexOf(dataTypeToCheck)>'-1'){
								$scope.temporaryNode.checked=true;
							}
					}
					else{
						dataTypeToCheck=$scope.mytree.currentNode.datatype;
						$scope.mytree.currentNode.clearList="";
							if($scope.clearList.indexOf(dataTypeToCheck)>'-1'){
								$scope.mytree.currentNode.clearList=true;
							}
							$scope.mytree.currentNode.checked="";
							if($scope.ShowChecked.indexOf(dataTypeToCheck)>'-1'){
								$scope.mytree.currentNode.checked=true;
							}
					}
					if($scope.disabledataTypes.indexOf(dataTypeToCheck)>'-1'){
						$scope.disableAddChild=false;
					}
					else{
						$scope.disableAddChild=true;
					}
				};
				//clear controls
				$scope.SetMode=function(value){
					$scope.mode=value;
					if(value=='addChild'){
						$scope.temporaryNode=undefined;
						$scope.temporaryNode = {};
						//reinitialise the dropdown 
						$scope.temporaryNode.datatype='Composite-selectsingle';
					}
				};
				
			}]).filter('pretty', function() {
		return function(input) {
			var temp;
			try {
				temp = angular.fromJson(input);
			} catch (e) {
				temp = input;
			}

			return angular.toJson(temp, true);
		};
	});
