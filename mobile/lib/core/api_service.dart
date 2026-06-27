import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio _dio;
  late final CookieJar _cookieJar;

  ApiService._internal() {
    _cookieJar = CookieJar();
    _dio = Dio(BaseOptions(
      baseUrl: apiUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    _dio.interceptors.add(CookieManager(_cookieJar));
  }

  Dio get dio => _dio;
  CookieJar get cookieJar => _cookieJar;

  Future<Map<String, dynamic>> get(String path) async {
    try {
      final response = await _dio.get(path);
      return response.data is Map<String, dynamic>
          ? response.data
          : {'data': response.data};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> post(String path, {Map<String, dynamic>? data}) async {
    try {
      final response = await _dio.post(path, data: data);
      return response.data is Map<String, dynamic>
          ? response.data
          : {'data': response.data};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> postFormData(String path, FormData formData) async {
    try {
      final response = await _dio.post(path, data: formData);
      return response.data is Map<String, dynamic>
          ? response.data
          : {'data': response.data};
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ApiException _handleError(DioException e) {
    final data = e.response?.data;
    String message = 'Network error. Please try again.';
    bool injectionDetected = false;

    if (data is Map<String, dynamic>) {
      message = data['error'] ?? data['message'] ?? message;
      injectionDetected = data['injectionDetected'] == true;
    }

    return ApiException(
      message: message,
      statusCode: e.response?.statusCode ?? 0,
      data: data is Map<String, dynamic> ? data : null,
      injectionDetected: injectionDetected,
    );
  }

  Future<void> clearCookies() async {
    await _cookieJar.deleteAll();
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  final Map<String, dynamic>? data;
  final bool injectionDetected;

  ApiException({
    required this.message,
    this.statusCode = 0,
    this.data,
    this.injectionDetected = false,
  });

  @override
  String toString() => message;
}
