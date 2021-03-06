
const model = require('../model');
let Products = model.products;
var products = [];
function Product(name, price) {//创建产品
    this.name = name;
    this.price = price;
}
module.exports = {
    getProducts: (name,price) => {//获取产品和搜索功能
        // console.log("name-------"+name)
        // console.log("price-------"+price)
        if(!name && !price){
           return (async () => {
                products = [];
                var pets = await Products.findAll({
                    'order': [
                        ['id', 'DESC']//降序
                        // ['id', 'ASC']//默认升序
                    ] 
                                });
                for (let p of pets) {
                    products.push(p);
                };
                 return products;
            })();
        }else{
            if(name && !price){
                return (async () => {
                var pets = await Products.findAll({
                    where: {
                                name: { $like: '%'+name+'%'}
                        
                    }
                })
                return pets;
                })();
            }else if(!name && price){
                return (async () => {
                var pets = await Products.findAll({
                    where: {
                                price: { $like: '%'+price+'%'}
                        
                    }
                })
                return pets;
                })();
            }else if(name && price){
                return (async () => {
                var pets = await Products.findAll({
                    where: {
                        '$and': [
                            {
                                name: { $like: '%'+name+'%'}
                            },
                            {
                                price: { $like: '%'+price+'%'}
                            }
                        ]
                    }
                })
                return pets;
                })();
            }
        }
    },

    getProduct: (id) => {//获取带id的产品
        var i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                return products[i];
            }
        }
        return null;
    },

    createProduct: (name,price) => {//创建新产品
        // console.log(name)
        var p = new Product(name, price);
        products.push(p);
        (async () => {
            await Products.create(p);
        })();
        return p;
    },
    editProduct: (id,name,price) => {//根据id编辑产品
        (async () => {
            var pets = await Products.findById(id);
            // pets.name = name;//更改数据
            // pets.price = price;
            // await pets.save();//执行save()操作sql
            await pets.update({//直接操作sql
                name :name,
                price :price

            })
        })();
        var
            index = -1,
            i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                products[index].name = name;
                products[index].price = price;
                break;
            }
        }
        if (index >= 0) {
            return products[index];
        }
    },
    deleteProduct: (id) => {//根据id删除产品
        (async () => {
            var pets = await Products.findById(id);
            await pets.destroy();

        })();
        var
            index = -1,
            i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            return products.splice(index, 1)[0];
        }
        return null;
    }
};
