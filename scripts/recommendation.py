import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from sklearn.preprocessing import OneHotEncoder
import sys
import json

# Kết nối tới MongoDB và tải dữ liệu product
client = MongoClient("mongodb://localhost:27017/")
db = client['JewelryStore_dev']
product_collection = db['products']

# Tải dữ liệu products (bao gồm các thuộc tính cần thiết)
products = list(product_collection.find({}, {
    '_id': 0,
    'productId': 1,
    'category': 1,
    'tag': 1,
    'men': 1
}))

# Chuyển dữ liệu thành DataFrame
product_df = pd.DataFrame(products)

# Đảm bảo dữ liệu hợp lệ và chuyển đổi các cột thành dạng chuỗi
product_df['category'] = product_df['category'].astype(str)
product_df['tag'] = product_df['tag'].astype(str)
product_df['men'] = product_df['men'].astype(str)  

# One-hot encode các thuộc tính
encoder = OneHotEncoder()
encoded_attributes = encoder.fit_transform(product_df[['category', 'tag', 'men']]).toarray()
product_attribute_matrix = pd.DataFrame(encoded_attributes, index=product_df['productId'])

# Tính toán độ tương đồng cosine giữa các sản phẩm
product_similarity_matrix = cosine_similarity(product_attribute_matrix)

# Chuyển ma trận độ tương đồng thành DataFrame để dễ dàng tra cứu
product_similarity_df = pd.DataFrame(product_similarity_matrix, index=product_df['productId'], columns=product_df['productId'])

# Hàm gợi ý sản phẩm dựa trên độ tương đồng
def get_product_recommendations(product_id, num_recommendations=5):
    if product_id not in product_similarity_df.columns:
        return []
    
    # Sắp xếp các sản phẩm theo điểm độ tương đồng
    similar_products = product_similarity_df[product_id].sort_values(ascending=False)
    # Loại bỏ sản phẩm gốc và chọn các sản phẩm tương tự nhất
    similar_products = similar_products.drop(product_id)
    
    return similar_products.head(num_recommendations).index.tolist()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Missing product ID")
    else:
        product_id = sys.argv[1]
        recommended_products = get_product_recommendations(product_id)
        print(json.dumps(recommended_products))
        sys.exit(0)
