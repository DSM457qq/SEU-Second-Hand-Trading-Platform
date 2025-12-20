# Flask应用初始化文件
from flask import Flask

def create_app():
    app = Flask(__name__)
    
    # 在这里可以进行应用配置
    
    # 注册蓝图或路由
    
    return app