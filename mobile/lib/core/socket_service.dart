import 'package:socket_io_client/socket_io_client.dart' as io;
import 'constants.dart';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;

  io.Socket? _socket;
  bool _isConnected = false;
  final List<Map<String, dynamic>> _routingEvents = [];
  final List<Function(Map<String, dynamic>)> _routingListeners = [];
  final List<Function(bool)> _connectionListeners = [];

  SocketService._internal();

  bool get isConnected => _isConnected;
  List<Map<String, dynamic>> get routingEvents => List.unmodifiable(_routingEvents);

  void connect(String sessionId) {
    disconnect();

    _socket = io.io(apiUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });

    _socket!.onConnect((_) {
      _isConnected = true;
      _socket!.emit('join-session', sessionId);
      _notifyConnectionListeners(true);
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      _notifyConnectionListeners(false);
    });

    _socket!.on('routing-event', (data) {
      if (data is Map<String, dynamic>) {
        _routingEvents.insert(0, data);
        if (_routingEvents.length > 50) {
          _routingEvents.removeLast();
        }
        _notifyRoutingListeners(data);
      }
    });

    _socket!.on('budget-update', (data) {
      if (data is Map<String, dynamic>) {
        final event = {'type': 'budget_update', ...data};
        _routingEvents.insert(0, event);
        if (_routingEvents.length > 50) {
          _routingEvents.removeLast();
        }
        _notifyRoutingListeners(event);
      }
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _isConnected = false;
  }

  void addRoutingListener(Function(Map<String, dynamic>) listener) {
    _routingListeners.add(listener);
  }

  void removeRoutingListener(Function(Map<String, dynamic>) listener) {
    _routingListeners.remove(listener);
  }

  void addConnectionListener(Function(bool) listener) {
    _connectionListeners.add(listener);
  }

  void removeConnectionListener(Function(bool) listener) {
    _connectionListeners.remove(listener);
  }

  void _notifyRoutingListeners(Map<String, dynamic> data) {
    for (final listener in _routingListeners) {
      listener(data);
    }
  }

  void _notifyConnectionListeners(bool connected) {
    for (final listener in _connectionListeners) {
      listener(connected);
    }
  }

  void clearEvents() {
    _routingEvents.clear();
  }
}
